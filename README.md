# Rapidez GTM

This Rapidez package provides 2 views with the GTM scripts, listens to events emitted by the Rapidez Core and adds ecommerce data to the datalayer. Currently for [Universal Analytics Enhanced Ecommerce](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce) but you can use this with Analytics 4 by using a [GTM Template](https://github.com/gtm-templates-knowit-experience/ga-eec-to-ga4-ecom-converter).

## Installation

```bash
composer require rapidez/gtm
```

And add your GTM ID in the `.env`
```env
GTM_ID=
```

And finally add `@include('rapidez-gtm::head')` and `@include('rapidez-gtm::foot')` in the head and at the bottom of your layout template, most likely at: `resources/views/vendor/rapidez/layouts/app.blade.php`. If you haven't published the Rapidez views yet, you can publish them with:

```bash
php artisan vendor:publish --provider="Rapidez\Core\RapidezServiceProvider" --tag=views
```

## Multistore

Just add all stores in `config/rapidez-gtm.php` after you've published the config with:
```bash
php artisan vendor:publish --provider="Rapidez\GTM\GTMServiceProvider" --tag=config
```
Where the key of the `id` array is the store code.

## Views

If you need to change the views you can publish them with:
```bash
php artisan vendor:publish --provider="Rapidez\GTM\GTMServiceProvider" --tag=views
```

## Purchase tracking

This package doesn't send any purchase events as it's better to send those from the backend in case a visitor blocks Analytics with a browser extension, for example with [elgentos/magento2-serversideanalytics](https://github.com/elgentos/magento2-serversideanalytics). To make sure the user ids from Analytics match and the purchase is linked to the correct visitor we advice you to install this fork: [jbclaudio/magento2-serversideanalytics](https://github.com/jbclaudio/magento2-serversideanalytics) which includes a "AddGaUserId" GraphQL mutation so it's possible to push the id from Rapidez to Magento. When installed you can enable it in the `.env` with:
```env
GTM_ELGENTOS=true
```

## Temporarily disable

If you'd like to test for example the Lighthouse scores without GTM you can disable it by added `?gtm=false` to the url

## Partytown

Scripts like GTM have a massive negative impact on performance and pagespeed, to remedy this scripts like [Partytown](https://partytown.builder.io/) have been made.
Which allows you to keep your analytics but reclaim _some_ of the performance.

Note that partytown is technically not production ready and still in beta.

### Installation

 - Execute `yarn add @builder.io/partytown`
 - [Configure Vite to copy the partytown files](https://partytown.builder.io/copy-library-files#vite) (however instead of dist it should go in public)
 - Make sure [symfony/psr-http-message-bridge](https://github.com/symfony/psr-http-message-bridge) is installed, if it is not: `composer require symfony/psr-http-message-bridge`
 - Enable partytown for GTM by adding `GTM_PARTYTOWN_ENABLE=true` to your .env

### Additional domains and CORS

Not all domains support partytown due to their CORS settings (https://partytown.builder.io/proxying-requests)
This package comes with a proxy for these domains which by default is only set up for GTM (see: config/rapidez-gtm.php)
If you notice more domains giving CORS errors you can add them to the config or in a comma seperated list in your .env under `GTM_PARTYTOWN_DOMAIN_WHITELIST`.

### Custom config

The partytown configuration is available in `window.partytown` so you can change the configuration by updating the configuration within `<script></script>` tags.

### Running partytown but not for GTM

If you want to run partytown but not for GTM that's possible too by configuring `GTM_PARTYTOWN_ENABLE=false` and manually including the partytown view in the head.

```blade
@push('head')
    @include('rapidez-gtm::partytown.index')
@endpush
```

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
