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

## License

GNU General Public License v3. Please see [License File](LICENSE) for more information.
