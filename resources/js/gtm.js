import * as ga4 from './datalayer/ga4.js';

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

window.dataLayers = {
    ga4: ga4,
}

/** @deprecated Call the respective function on the ga4 or window.ga4 object instead. */
window.sendDataLayer = function (func, ...args) {
    if (!('dataLayer' in window)) {
        return
    }
    
    if(dataLayers?.ga4?.[func]) {
        dataLayers?.ga4?.[func](...args);
    }
}

document.addEventListener('vue:loaded', async () => {
    if (!('dataLayer' in window)) {
        return;
    }
    if (window.config.gtm['clear-on-load']) {
        window.dataLayer = []
    }

    let url = new URL(window.location.href);

    ga4.pageView(window.location.href);

    if (window.config.product) {
        ga4.productView()
    }

    if (url.pathname === '/search' && url.searchParams.has('q')) {
        ga4.search(url.searchParams.get('q'))
    }

    if (url.pathname === '/cart') {
        ga4.viewCart();
    }

    if (url.pathname === '/checkout') {
        ga4.beginCheckout()
    }

    window.app.$on('logged-in', () => {
        ga4.login()
    })

    window.app.$on('cart-add', (data) => {
        ga4.addToCart(data)
    })

    window.app.$on('cart-remove', (item) => {
        ga4.removeFromCart(item)
    })

    window.app.$on('checkout-credentials-saved', () => {
        ga4.addShippingInfo()
    })

    window.app.$on('checkout-payment-saved', () => {
        ga4.addPaymentInfo()
    })

    window.app.$on('checkout-success', (order) => {
        ga4.purchase(order)
    })

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
