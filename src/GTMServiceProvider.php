<?php

namespace Rapidez\GTM;

use GuzzleHttp\Exception\TransferException;
use Illuminate\Http\Client\HttpClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class GTMServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/rapidez-gtm.php', 'rapidez-gtm');

        $this->publishes([
            __DIR__.'/../config/rapidez-gtm.php' => config_path('rapidez-gtm.php'),
        ], 'config');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'rapidez-gtm');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/rapidez-gtm'),
        ], 'views');

        $this->bootRoutes();

        config([
            'frontend.gtm.elgentos-serverside' => config('rapidez-gtm.elgentos-serverside'),
            'frontend.gtm.clear-on-load' => config('rapidez-gtm.clear-on-load'),

            // These values go through eval(), this way you can add values
            // easily from your AppServiceProvider, for example with:
            // config(['frontend.gtm.productpage.something' => 'window.config.product.something']);
            'frontend.gtm.productpage' => [
                'name' => 'window.config.product.name',
                'id' => 'window.config.product.id',
                'price' => 'removeTrailingZeros(window.config.product.price)',
            ],
        ]);
    }

    public function bootRoutes() {
        Route::any('proxy/{url}', function (Request $request, $url) {
            // On nginx we can replace this with https://serverfault.com/a/744626
            // As a result we could also cache the scripts returned https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/
            abort_if(!$url || !in_array(parse_url($url, PHP_URL_HOST), config('rapidez-gtm.partytown.domain_whitelist')), 404);

            try  {
                return Http::retry(3, 100, null, false)->send($request->method(), $url, ['query' => $request->query()])->toPsrResponse();
            } catch (TransferException|HttpClientException $e) {
                // Catch client errors to prevent error reporting, as marketing sites are notorious for timeouts, dropped connections, etc.
                abort(404);
            }
        })->where('url', '.+')->name('rapidez-gtm::proxy');

        return $this;
    }
}
