import * as ga4 from './datalayer/ga4.js';
import { on } from 'Vendor/rapidez/core/resources/js/polyfills/emit.js';

window.removeTrailingZeros = (price) =>  parseFloat(parseFloat(price).toString());

function getUserId() {
    // Prefer Vue 3 globalProperties cookies if available, fallback to legacy window.app.$cookies
    let gaCookie = window.app?.config?.globalProperties?.$cookies?.get('_ga') || window.app?.$cookies?.get('_ga')

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

    let gsCookie = window.app?.config?.globalProperties?.$cookies?.get('_ga_' + gaId.substring(2)) || window.app?.$cookies?.get('_ga_' + gaId.substring(2));

    if (!gsCookie) {
        return
    }

    return gsCookie?.match(/^GS[0-9]\.[0-9]\.s?(?<session_id>[0-9]+)/)?.groups?.session_id
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

    on('registered', () => {
       ga4.register()
    });
    
    on('logged-in', () => {
        ga4.login()
    })

    on('cart-add', (data) => {
        ga4.addToCart(data)
    })

    on('cart-remove', (item) => {
        ga4.removeFromCart(item)
    })

    on('checkout-credentials-saved', () => {
        ga4.addShippingInfo()
    })

    on('checkout-payment-saved', () => {
        ga4.addPaymentInfo()
    })

    on('checkout-success', (order) => {
        ga4.purchase(order)
    })

    if (window.config.gtm['elgentos-serverside']) {
        on('rapidez:checkout-credentials-saved', (data) => {
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
