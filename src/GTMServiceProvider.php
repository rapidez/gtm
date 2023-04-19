<?php

namespace Rapidez\GTM;

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

        Route::prefix('gtm')
            ->middleware('web')
            ->group(__DIR__ . '/../routes/web.php');

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
}
