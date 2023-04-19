@once
<script>
    partytown = {
        forward: [],
        debug: {{ config('app.debug', false) ? 'true' : 'false' }},
        resolveUrl: function (url, location, type) {
            if (@json(config('rapidez.partytown')).includes(url.host)) {
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
