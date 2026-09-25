import { cart } from 'Vendor/rapidez/core/resources/js/stores/useCart.js'

const price = (value) => removeTrailingZeros(parseFloat(value || 0).toFixed(4))

const optionsPrice = (items) => items.reduce((total, item) => total + item.price, 0)

const itemsValue = (items) => price(items.reduce((total, item) => total + item.price * item.quantity, 0))

const push = (event, ecommerce, data = {}) => {
    dataLayer.push({ ecommerce: null })
    dataLayer.push({
        event: event,
        ecommerce: ecommerce,
        ...data,
    })
}

// Option prices are catalog prices, when those exclude tax we
// use the tax rate of the item to get the price including tax.
const taxRate = (prices) => window.config.price_includes_tax === false && prices?.price?.value
    ? prices.price_including_tax.value / prices.price.value
    : 1

// Chosen custom options (accessories, services, etc.) of a cart or order item as separate items.
// These are matched against the product options for the SKU and price, so only options
// queried within the product fragment are included.
const optionItems = (item, options, quantity, itemPrice) => {
    let productOptionValues = (item?.product?.options || []).flatMap((productOption) =>
        [].concat(productOption?.value || []).map((productValue) => ({ ...productValue, option_title: productOption?.title }))
    )

    let values = (options || []).flatMap((option) => {
        // Cart items have a values array, order items a comma separated value.
        let optionValues = option?.values || String(option?.value ?? '').split(', ').map((label) => ({ label }))

        return optionValues.map((value) => {
            let productOptionValue = productOptionValues.find((productValue) => value?.customizable_option_value_uid
                ? productValue.uid === value.customizable_option_value_uid
                : productValue.option_title === option?.label && productValue.title === value?.label
            )

            return {
                option: option,
                value: value,
                productOptionValue: productOptionValue,
                price: value?.price?.value ?? productOptionValue?.price ?? 0,
                percent: (value?.price?.type ?? productOptionValue?.price_type) === 'PERCENT',
            }
        })
    })

    // Percentages are calculated over the product price without any options
    let rate = taxRate(item?.prices)
    let fixed = values.filter((value) => !value.percent).reduce((total, value) => total + value.price * rate, 0)
    let percentage = values.filter((value) => value.percent).reduce((total, value) => total + value.price, 0)
    let basePrice = (itemPrice - fixed) / (1 + percentage / 100)

    return values.filter(({ productOptionValue }) => productOptionValue).map(({ option, value, productOptionValue, price: optionPrice, percent }) => ({
        item_id: productOptionValue.sku || productOptionValue.title,
        item_name: value?.label || productOptionValue.title,
        item_parent_sku: item?.product?.sku,
        item_parent_name: item?.product?.name,
        item_option: option?.label,
        price: price(percent ? basePrice * optionPrice / 100 : optionPrice * rate),
        quantity: quantity,
    }))
}

const cartItems = (item, quantity = item?.quantity) => {
    let itemPrice = item?.prices?.price_including_tax?.value
    let options = optionItems(item, item?.customizable_options, quantity, itemPrice)

    return [{
        item_id: item?.configured_variant?.sku || item?.product?.sku,
        item_name: item?.product?.name,
        item_parent_sku: item?.product?.sku,
        item_parent_name: item?.product?.name,
        // The item price includes the chosen options
        price: price(itemPrice - optionsPrice(options)),
        quantity: quantity,
    }, ...options]
}

const orderItems = (item) => {
    let itemPrice = item?.prices?.price_including_tax?.value ?? item?.product_sale_price?.value
    let options = optionItems(item, item?.selected_options, item?.quantity_ordered, itemPrice)
    // Magento appends the SKUs of the chosen options to the product SKU
    let sku = options.reduce((sku, option) => sku.replace('-' + option.item_id, ''), item?.product_sku || '')

    return [{
        item_id: sku || item?.product?.sku,
        item_name: item?.product?.name,
        item_parent_sku: item?.parent_sku || item?.product?.sku,
        item_parent_name: item?.product?.name,
        // The item price includes the chosen options
        price: price(itemPrice - optionsPrice(options)),
        coupon: item?.discounts?.find((discount) => discount?.coupon?.code)?.coupon?.code,
        discount: item?.discounts?.reduce((discountAmount, discount) => discountAmount + (discount?.amount?.value || 0), 0),
        quantity: item?.quantity_ordered,
    }, ...options]
}

const cartEvent = (event, ecommerce = {}) => {
    if (!cart.value?.items) {
        return
    }

    push(event, {
        currency: window.config.currency,
        value: price(cart.value?.prices?.grand_total?.value),
        ...ecommerce,
        items: Object.values(cart.value.items).flatMap((item) => cartItems(item)),
    })
}

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
    push('view_item', {
        currency: window.config.currency,
        value: removeTrailingZeros(window.config.product.price),
        items: [
            // See the GTMServiceProvider for the values
            Object.fromEntries(Object.entries(config.gtm.productpage).map(([key, value]) => [key, (0, eval)(value)]))
        ]
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
    push('view_item_list', {
        item_list_id: item_list_id,
        item_list_name: item_list_name,
        items: items.map((item) => {
            return {
                item_id: item.sku,
                item_name: item.name,
                price: removeTrailingZeros(item.price),
            }
        })
    })
}

export const selectItem = async (item, item_list_id, item_list_name) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#select_item
    push('select_item', {
        item_list_id: item_list_id,
        item_list_name: item_list_name,
        items: [
            {
                item_id: item.sku,
                item_name: item.name,
                price: removeTrailingZeros(item.price),
            }
        ]
    })
}

export const addToWishlist = async (data) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_to_wishlist
    push('add_to_wishlist', {
        currency: window.config.currency,
        value: removeTrailingZeros(data.product.price),
        items: [{
            item_id: data.product.sku,
            item_name: data.product.name,
            price: removeTrailingZeros(data.product.price),
            quantity: data.qty,
        }]
    })
}

export const addToCart = async (data) => {
    // The cart is already updated when this event is emitted,
    // so the last matching cart item is the one just added.
    let item = Object.values(cart.value?.items || {}).findLast((item) =>
        item?.product?.sku === data?.product?.sku
        && (!data?.simpleProduct?.sku || !item?.configured_variant?.sku || item.configured_variant.sku === data.simpleProduct.sku)
    )

    let items = item ? cartItems(item, data.qty) : [{
        item_id: data?.simpleProduct?.sku || data?.product?.sku,
        item_name: data?.simpleProduct?.name || data?.product?.name,
        item_parent_sku: data?.product?.sku,
        item_parent_name: data?.product?.name,
        price: price(data?.simpleProduct?.price || data?.product?.price),
        quantity: data.qty,
    }]

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_to_cart
    push('add_to_cart', {
        currency: window.config.currency,
        value: itemsValue(items),
        items: items,
    })
}

export const removeFromCart = async (item) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#remove_from_cart
    push('remove_from_cart', {
        currency: window.config.currency,
        value: price(item?.prices?.row_total_including_tax?.value),
        items: cartItems(item),
    })
}

export const viewCart = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_cart
    cartEvent('view_cart')
}

export const beginCheckout = async (step) => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#begin_checkout
    cartEvent('begin_checkout')
}

export const addShippingInfo = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_shipping_info
    cartEvent('add_shipping_info', {
        shipping_tier: cart.value?.shipping_addresses?.[0]?.selected_shipping_method?.method_code,
    })
}

export const addPaymentInfo = async () => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#add_payment_info
    cartEvent('add_payment_info', {
        payment_type: cart.value?.selected_payment_method?.code,
    })
}

export const purchase = async (order) => {
    if (!order?.items) {
        return
    }

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#purchase
    push(window.config.gtm['purchase-event-name'], {
        currency: order?.total?.base_grand_total?.currency || window.config.currency,
        value: removeTrailingZeros(order?.total?.base_grand_total?.value),
        transaction_id: order?.number,
        coupon: order?.total?.discounts?.find((discount) => discount?.coupon?.code)?.coupon?.code,
        shipping: removeTrailingZeros(order?.total?.total_shipping?.value),
        tax: removeTrailingZeros(order?.total?.total_tax?.value),
        items: Object.values(order.items).flatMap(orderItems).map((item, index) => ({ index: index, ...item })),
    })
}
