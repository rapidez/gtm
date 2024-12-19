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

function sendDataLayer(func, ...args) {
    if (!('dataLayer' in window)) {
        return
    }
    
    ['ua', 'ga4'].forEach(layer => {
        if(dataLayers?.[layer]?.[func]) {
            dataLayers?.[layer]?.[func](...args);
        }
    })
}

window.sendDataLayer = sendDataLayer;

document.addEventListener('vue:loaded', async (event) => {
    if (!('dataLayer' in window)) {
        return;
    }
    if (window.config.gtm['clear-on-load']) {
        window.dataLayer = []
    }

    window.app.$on('logged-in', () => {
        sendDataLayer('login');
    })

    window.app.$on('cart-add', (data) => {
        sendDataLayer('addToCart', data);
    })

    window.app.$on('cart-remove', (item) => {
        sendDataLayer('removeFromCart', item);
    })

    window.app.$on('checkout-step', (step) => {
        sendDataLayer('checkoutStep', step);
        if (step === 1) {
            sendDataLayer('beginCheckout');
        }
    })

    window.app.$on('checkout-credentials-saved', () => {
        sendDataLayer('addShippingInfo');
    })

    window.app.$on('checkout-payment-saved', () => {
        sendDataLayer('addPaymentInfo');
    })

    window.app.$on('checkout-success', (order) => {
        sendDataLayer('purchase', order);
    })
    
    await dataLayersPromise

    let url = new URL(window.location.href);

    sendDataLayer('pageView', window.location.href);

    if (window.config.product) {
        sendDataLayer('productView', window.location.href);
    }

    if (url.pathname === '/search' && url.searchParams.has('q')) {
        sendDataLayer('search', url.searchParams.get('q'));
    }

    if (url.pathname === '/cart') {
        sendDataLayer('viewCart');
    }

    if (window.config.gtm['elgentos-serverside']) {
        window.app.$on('checkout-credentials-saved', (data) => {
            let gaUserId = getUserId();
            let gaSessionId = getSessionId();

            if (!localStorage.mask || (!gaUserId && !gaSessionId)) {
                return
            }

            let query = `mutation StartTransaction(
                $cartId: String!
                $gaUserId: String
                $gaSessionId: String
            ) {
                AddGaUserId (
                    input: {
                        cartId: $cartId
                        gaUserId: $gaUserId
                        gaSessionId: $gaSessionId
                    }
                ) {
                    cartId
                    maskedId
                }
            }`
            let variables = {
                cartId: localStorage.mask,
                gaUserId: gaUserId,
                gaSessionId: gaSessionId,
            }
            window.magentoGraphQL(query, variables)
        });
    }
}, {passive: true})
