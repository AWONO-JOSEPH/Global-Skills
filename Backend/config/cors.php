<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://global-skills.vercel.app',
        'https://global-skills-git-main-awono-josephs-projects.vercel.app',
        'https://global-skills-gmgo15ovj-awono-josephs-projects.vercel.app',
    ],

    'allowed_origins_patterns' => [
        'https://.*\.vercel\.app',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
