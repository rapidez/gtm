<?php

return [
    'id' => [
        'default' => env('GTM_ID'),
    ],

    'elgentos-serverside' => env('GTM_ELGENTOS', false),

    'clear-on-load' => env('GTM_CLEAR_ON_LOAD', false),

    'partytown' => [
        'enabled' => env('GTM_PARTYTOWN_ENABLE', false),
        'domain_whitelist' => array_merge(
            explode(',', env('GTM_PARTYTOWN_DOMAIN_WHITELIST', '')),
            [
                'googletagmanager.com',
                'www.googletagmanager.com',
                'www.google-analytics.com',
                'www.googleadservices.com',
                'googleads.g.doubleclick.net',
            ]
        ),
    ]
];
