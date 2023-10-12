window.removeTrailingZeros = (price) =>  parseFloat(parseFloat(price).toString());

function getUserId() {
    let gaCookie = window.app.$cookies.get('_ga')

    if (!gaCookie) {
        return
    }

    gaCookie = gaCookie.split('.')

    if (gaCookie.length !== 4) {
        return
    }

    return gaCookie[2] + '.' + gaCookie[3]
}

function getSessionId() {
    let gaId = Object.keys(window?.google_tag_manager || {})?.find((key) => key.match(/G-[0-9A-Z]+/))

    if (!gaId) {
        return
    }

    let gsCookie = window.app.$cookies.get('_ga_' + gaId.substring(2));

    if (!gsCookie) {
        return
    }

    return gsCookie.split('.')?.[2]
}

let dataLayersPromise = (async () => {
    // This async function is in order to work around "ERROR: Top-level await is not available" when building for older browsers.
    window.dataLayers = {
        ua: window.config.gtm['send-ua-events'] ? await import('./datalayer/ua.js') : undefined,
        ga4: window.config.gtm['send-ga4-events'] ? await import('./datalayer/ga4.js') : undefined,
    }
})()

document.addEventListener('turbo:load', async (event) => {
    if (!('dataLayer' in window)) {
        return;
    }
    if (window.config.gtm['clear-on-load']) {
        window.dataLayer = []
    }
    await dataLayersPromise

    let url = new URL(event.detail.url);

    dataLayers?.ua?.pageView(event.detail.url);
    dataLayers?.ga4?.pageView(event.detail.url);

    if (window.config.product) {
        dataLayers?.ua?.productView(event.detail.url);
        dataLayers?.ga4?.productView(event.detail.url);
    }

    if (url.pathname === '/search' && url.searchParams.has('q')) {
        dataLayers?.ga4?.search(url.searchParams.get('q'));
    }

    if (url.pathname === '/cart') {
        dataLayers?.ga4?.viewCart();
    }

    window.app.$on('logged-in', () => {
        dataLayers?.ga4?.login();
    })

    window.app.$on('cart-add', (data) => {
        dataLayers?.ua?.addToCart(data);
        dataLayers?.ga4?.addToCart(data);
    })

    window.app.$on('cart-remove', (item) => {
        dataLayers?.ua?.removeFromCart(item);
        dataLayers?.ga4?.removeFromCart(item);
    })

    window.app.$on('checkout-step', (step) => {
        dataLayers?.ua?.checkoutStep(step);
        if (step === 1) {
            dataLayers?.ga4?.beginCheckout();
        }
    })

    window.app.$on('checkout-credentials-saved', () => {
        dataLayers?.ga4?.addShippingInfo();
    })

    window.app.$on('checkout-payment-saved', () => {
        dataLayers?.ga4?.addPaymentInfo();
    })

    if (window.config.gtm['elgentos-serverside']) {
        window.app.$on('checkout-credentials-saved', (data) => {
            let gaUserId = getUserId();
            let gaSessionId = getSessionId();

            axios.post(config.magento_url + '/graphql', {
                query:
                `mutation StartTransaction(
                    $cartId: String!
                    $gaUserId: String
                    $gaSessionId: String
                ) {
                    AddGaUserId (
                        cartId: $cartId
                        gaUserId: $gaUserId
                        gaSessionId: $gaSessionId
                    ) {
                        cartId
                        maskedId
                    }
                }`,
                variables: {
                    cartId: localStorage.mask,
                    gaUserId: gaUserId,
                    gaSessionId: gaSessionId,
                }
            }, options)
        });
    }
}, {passive: true})
