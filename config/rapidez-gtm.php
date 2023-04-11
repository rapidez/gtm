<?php

return [
    'id' => [
        'default' => env('GTM_ID'),
    ],

    'elgentos-serverside' => env('GTM_ELGENTOS', false),

    'clear-on-load' => env('GTM_CLEAR_ON_LOAD', false),
];
