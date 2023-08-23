@once
<script>
    partytown = {
        forward: [],
        debug: {{ var_export(config('app.debug'), true) }},
        resolveUrl: function (url, location, type) {
            if (@json(config('rapidez-gtm.partytown.domain_whitelist')).includes(url.host)) {
                return @json(route('rapidez-gtm::proxy', ['url' => '/'], false) . '/') + url.href;
            }
            return url
        }
    }

    @if(config('rapidez-gtm.partytown.enabled'))
        partytown.forward.push('dataLayer.push');
    @endif
</script>
@endonce
