<?php

namespace Rapidez\GTM;

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

        config(['frontend.gtm.elgentos-serverside' => config('rapidez-gtm.elgentos-serverside')]);
    }
}
