export const pageView = async (url) => {
    window.dataLayer.push({
        event: 'pageView',
        virtualUrl: url
    })
}

export const productView = async (url) => {
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        'ecommerce': {
            'detail': {
                'products': [
                    // See the GTMServiceProvider for the values
                    Object.fromEntries(Object.entries(config.gtm.productpage).map(([key, value]) => [key, eval(value)]))
                ]
            }
        }
    })
}

export const addToCart = async (data) => {
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        'event': 'addToCart',
        'ecommerce': {
            'currencyCode': window.config.currency,
            'add': {
                'products': [{
                    'name': data.product.name,
                    'id': data.product.entity_id || data.product.id,
                    'price': removeTrailingZeros(data.product.price),
                    'quantity': data.qty,
                }]
            }
        }
    })
}

export const removeFromCart = async (item) => {
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        'event': 'removeFromCart',
        'ecommerce': {
            'remove': {
                'products': [{
                    'name': item.name,
                    'id': item.product_id,
                    'price': removeTrailingZeros(item.price),
                    'quantity': item.qty,
                }]
            }
        }
    })
}

export const checkoutStep = async (step) => {
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        'event': 'checkout',
        'ecommerce': {
            'checkout': {
                'actionField': {'step': step},
                'products': Object.values(window.app.cart.items).map(function (item) {
                    return {
                        name: item.name,
                        id: item.product_id,
                        price: item.price,
                        quantity: item.qty,
                    }
                }),
            }
        }
    })
}
