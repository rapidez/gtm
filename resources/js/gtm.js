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
    ['ua', 'ga4'].forEach(layer => {
        if(dataLayers?.[layer]?.[func]) {
            dataLayers?.[layer]?.[func](...args);
        }
    })
}

document.addEventListener('turbo:load', async (event) => {
    if (!('dataLayer' in window)) {
        return;
    }
    if (window.config.gtm['clear-on-load']) {
        window.dataLayer = []
    }
    await dataLayersPromise

    let url = new URL(event.detail.url);

    sendDataLayer('pageView', event.detail.url);

    if (window.config.product) {
        sendDataLayer('productView', event.detail.url);
    }

    if (url.pathname === '/search' && url.searchParams.has('q')) {
        sendDataLayer('search', url.searchParams.get('q'));
    }

    if (url.pathname === '/cart') {
        sendDataLayer('viewCart');
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

    if (window.config.gtm['elgentos-serverside']) {
        window.app.$on('checkout-credentials-saved', (data) => {
            let gaUserId = getUserId();
            let gaSessionId = getSessionId();

            let options = { headers: { Store: window.config.store_code } }
            if (window.magentoUser.defaults.headers.common['Authorization']?.length > 7) {
                options['headers']['Authorization'] = window.magentoUser.defaults.headers.common['Authorization']
            }

            if (!localStorage.mask || (!gaUserId && !gaSessionId)) {
                return
            }

            axios.post(config.magento_url + '/graphql', {
                query:
                `mutation StartTransaction(
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
