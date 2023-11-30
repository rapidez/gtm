<?php

return [
    'id' => [
        'default' => env('GTM_ID'),
    ],

    'elgentos-serverside' => env('GTM_ELGENTOS', false),

    'clear-on-load' => env('GTM_CLEAR_ON_LOAD', false),

    'send-ua-events' => env('GTM_SEND_UA_EVENTS', true),
    'send-ga4-events' => env('GTM_SEND_GA4_EVENTS', false),

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
