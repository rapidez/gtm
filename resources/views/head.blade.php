@if(config('rapidez-gtm.id.'.config('rapidez.store_code')) && !request()->has('gtm'))
    <script>window.dataLayer = window.dataLayer || [];</script>
    <script type="text/{{ config('rapidez-gtm.partytown.enabled') ? 'partytown' : 'javascript' }}">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ config('rapidez-gtm.id.'.config('rapidez.store_code')) }}');</script>
    @includeWhen(config('rapidez-gtm.partytown.enabled'), 'rapidez-gtm::partytown.index')
@endif
