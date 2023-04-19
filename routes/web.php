<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::get('proxy/{url}', function (Request $request, $url) {
    // On nginx we can replace this with https://serverfault.com/a/744626
    // As a result we could also cache the scripts returned https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/
    abort_if(!$url || !in_array(parse_url($url, PHP_URL_HOST), config('rapidez-gtm.partytown.domain_whitelist')), 404);

    $queryString = $request->getQueryString();
    return Http::retry(3, 100, null, false)->get($url . ($queryString ? '?' . $queryString : ''))->toPsrResponse();
})->where('url', '.+')->name('rapidez-gtm::proxy');
