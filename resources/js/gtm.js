function removeTrailingZeros(price) {
    return parseFloat(parseFloat(price).toString())
}

document.addEventListener('turbo:load', (event) => {
    if ('dataLayer' in window) {
        if (window.config.gtm['clear-on-load']) {
            window.dataLayer = []
        }

        window.dataLayer.push({
            'event': 'pageView',
            'virtualUrl': event.detail.url
        })

        if (window.config.product) {
            let product = {}

            // See the GTMServiceProvider for the values
            Object.entries(config.gtm.productpage).forEach(([key, value]) => {
                product[key] = eval(value)
            })

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'ecommerce': {
                    'detail': {
                        'products': [product]
                    }
                }
            })
        }

        window.app.$on('cart-add', (data) => {
            dataLayer.push({ ecommerce: null })
            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': window.config.currency,
                    'add': {
                        'products': [{
                            'name': data.product.name,
                            'id': data.product.id,
                            'price': removeTrailingZeros(data.product.price),
                            'quantity': data.qty,
                         }]
                    }
                }
            })
        })

        window.app.$on('cart-remove', (item) => {
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
        })

        window.app.$on('checkout-step', (step) => {
            let products = []
            Object.values(window.app.cart.items).forEach(function (item) {
                products.push({
                    name: item.name,
                    id: item.product_id,
                    price: item.price,
                    quantity: item.qty,
                })
            })

            dataLayer.push({ ecommerce: null })
            dataLayer.push({
                'event': 'checkout',
                'ecommerce': {
                    'checkout': {
                        'actionField': {'step': step},
                        'products': products,
                    }
                }
            })
        })

        if (window.config.gtm['elgentos-serverside']) {
            window.app.$on('checkout-credentials-saved', (data) => {
                let gaCookie = window.app.$cookies.get('_ga')

                if (!gaCookie) {
                    return
                }

                gaCookie = gaCookie.split('.')

                if (gaCookie.length !== 4) {
                    return
                }

                let gaUserId = gaCookie[2] + '.' + gaCookie[3]

                let options = { headers: {} }
                if (localStorage.token) {
                    options['headers']['Authorization'] = `Bearer ${localStorage.token}`
                }

                axios.post(config.magento_url + '/graphql', {
                    query:
                    `mutation StartTransaction(
                        $cartId: String
                        $gaUserId: String
                    ) {
                        AddGaUserId (
                            cartId: $cartId
                            gaUserId: $gaUserId
                        ) {
                            cartId
                            maskedId
                        }
                    }`,
                    variables: {
                        cartId: localStorage.mask,
                        gaUserId: gaUserId,
                    }
                }, options)
            });
        }
    }
})
