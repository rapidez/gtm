export const pageView = async (url) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtm
    window.dataLayer.push({
        event: 'page_view',
        page_location: url,
        page_title: document.title,
    })
}

export const productView = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_item
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'view_item',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(window.config.product.price),
            items: [
                // See the GTMServiceProvider for the values
                Object.fromEntries(Object.entries(config.gtm.productpage).map(([key, value]) => [key, eval(value)]))
            ]
        }
    })
}

export const register = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#sign_up
    dataLayer.push({
        event: 'sign_up',
    })
}

export const login = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#login
    dataLayer.push({
        event: 'login',
    })
}

export const search = async (searchTerm) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#search
    dataLayer.push({
        event: 'search',
        search_term: searchTerm,
    })
}

export const viewItemList = async (items, item_list_id, item_list_name) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_item_list
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'view_item_list',
        ecommerce: {
            item_list_id: item_list_id,
            item_list_name: item_list_name,
            items: items.map((item) => {
                return {
                    item_id: item.sku,
                    item_name: item.name,
                    price: removeTrailingZeros(item.price),
                }
            })
        }
    })
}

export const selectItem = async (item, item_list_id, item_list_name) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#select_item
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'select_item',
        ecommerce: {
            item_list_id: item_list_id,
            item_list_name: item_list_name,
            items: [
                {
                    item_id: item.sku,
                    item_name: item.name,
                    price: removeTrailingZeros(item.price),
                }
            ]
        }
    })
}

export const addToWishlist = async (data) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_to_wishlist
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'add_to_wishlist',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(data.product.price),
            items: [{
                item_id: data.product.sku,
                item_name: data.product.name,
                price: removeTrailingZeros(data.product.price),
                quantity: data.qty,
            }]
        }
    })
}

export const addToCart = async (data) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_to_cart
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(data.product.price),
            items: [{
                item_id: data.product.sku,
                item_name: data.product.name,
                price: removeTrailingZeros(data.product.price),
                quantity: data.qty,
            }]
        }
    })
}

export const removeFromCart = async (item) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#remove_from_cart
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(item.price),
            items: [{
                item_id: item.sku,
                item_name: item.name,
                price: removeTrailingZeros(item.price),
                quantity: item.qty,
            }]
        }
    })
}

export const viewCart = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_cart
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'view_cart',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(window.app.cart.total),
            items: Object.values(window.app.cart.items).map(function (item) {
                return {
                    item_name: item.name,
                    item_id: item.sku,
                    price: item.price,
                    quantity: item.qty,
                }
            }),
        }
    })
}

export const beginCheckout = async (step) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#begin_checkout
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(window.app.cart.total),
            items: Object.values(window.app.cart.items).map(function (item) {
                return {
                    item_name: item.name,
                    item_id: item.sku,
                    price: item.price,
                    quantity: item.qty,
                }
            }),
        }
    })
}

export const addShippingInfo = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_shipping_info
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(window.app.cart.total),
            shipping_tier: window.app.checkout.shipping_method,
            items: Object.values(window.app.cart.items).map(function (item) {
                return {
                    item_name: item.name,
                    item_id: item.sku,
                    price: item.price,
                    quantity: item.qty,
                }
            }),
        }
    })
}

export const addPaymentInfo = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_payment_info
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
            currency: window.config.currency,
            value: removeTrailingZeros(window.app.cart.total),
            payment_type: window.app.checkout.payment_method,
            items: Object.values(window.app.cart.items).map(function (item) {
                return {
                    item_name: item.name,
                    item_id: item.sku,
                    price: item.price,
                    quantity: item.qty,
                }
            }),
        }
    })
}
