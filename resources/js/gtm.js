function removeTrailingZeros(price) {
    return parseFloat(parseFloat(price).toString())
}

document.addEventListener('turbolinks:load', (event) => {
    if ('dataLayer' in window) {
        window.dataLayer.push({
            'event': 'pageView',
            'virtualUrl': event.data.url
        })

        if (window.config.product) {
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'ecommerce': {
                    'detail': {
                        'products': [{
                            'name': window.config.product.name,
                            'id': window.config.product.id,
                            'price': removeTrailingZeros(window.config.product.price),
                        }]
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
