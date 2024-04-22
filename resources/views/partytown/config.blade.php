@once
<script>
    partytown = {
        forward: [],
        mainWindowAccessors: [],
        debug: {{ var_export(config('app.debug'), true) }},
        resolveUrl: function (url, location, type) {
            if (@json(config('rapidez.gtm.partytown.domain_whitelist')).includes(url.host)) {
                return @json(route('rapidez-gtm::proxy', ['url' => '/'], false) . '/') + url.href;
            }
            return url
        }
    }

    @if(config('rapidez.gtm.partytown.enabled'))
        partytown.forward.push(['dataLayer.push', { preserveBehavior: true }]);
        
        if (window.__TAG_ASSISTANT_API !== undefined) {
            // Tag assistant compatibility
            partytown.forward.push('__tag_assistant_forwarder');
            partytown.mainWindowAccessors.push('__tag_assistant_accessor');
            
            const gtmDebugLog = (msg, data) => {
                if (window.partytown.debug) {
                    console.debug(
                    `%cGTM Main%c${msg}`,
                    `background: #c47ed1; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;margin-right:5px`,
                    `background: #999999; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`,
                    data && data.length ? Array.from(data) : data
                    )
                }
            }

            __tag_assistant_accessor = {
                receiver: function(...args) {
                    window.__tag_assistant_forwarder.apply(null, arguments);
                },

                // Called when receiver has been set inside partytown, calls __TAG_ASSISTANT_API.setReceiver
                setReceiver: function () {
                    gtmDebugLog('activate')
                    window.__TAG_ASSISTANT_API.setReceiver(function() {
                        gtmDebugLog('send data', arguments)
                        window.__tag_assistant_forwarder.apply(null, arguments);
                    })
                },

                // Forwards calls from bootstrap
                sendMessage: function() {
                    gtmDebugLog('send message', arguments)
                    window.__TAG_ASSISTANT_API.sendMessage.apply(window.__TAG_ASSISTANT_API, arguments)
                },
                // Forwards calls from bootstrap
                disconnect: function() {
                    gtmDebugLog('disconnect', arguments)
                    window.__TAG_ASSISTANT_API.disconnect.apply(window.__TAG_ASSISTANT_API, arguments)
                },
            }
        }
    @endif
</script>
@if(config('rapidez.gtm.partytown.enabled'))
<script type="text/partytown">
    window.__TAG_ASSISTANT_API = window.__TAG_ASSISTANT_API || Object.assign({}, window.__tag_assistant_accessor, {
        // Override setReceiver to enable main <-> worker communication
        setReceiver: (receiver) => {
            // The receiving function is assigned to `window[tagAssistantForwarderName]`,
            // allowing it to be called from the main thread.
            // @ts-ignore
            window.__tag_assistant_forwarder = receiver;

            // The original setReceiver function is called to notify the main thread that
            // the receiver has been set.
            window.__tag_assistant_accessor?.setReceiver();
        }
    });
</script>
@endif
@endonce
