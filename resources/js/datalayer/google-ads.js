import { cart } from 'Vendor/rapidez/core/resources/js/stores/useCart.js'
import { user } from 'Vendor/rapidez/core/resources/js/stores/useUser.js'

export const setUserData = async (userData = {
        email: user.value?.email || cart.value?.email || window.app.config.globalProperties.guestEmail,
        phone_number: cart.value?.billing_address?.telephone?.replaceAll(/[^0-9\+]*/g, ''),
        address: {
            first_name: cart.value?.billing_address?.firstname,
            last_name: cart.value?.billing_address?.lastname,
            street: cart.value?.billing_address?.street?.join("\n"),
            city: cart.value?.billing_address?.city,
            postal_code: cart.value?.billing_address?.postcode,
            country: cart.value?.billing_address?.country?.code,
        }
    }
) => {
    // https://support.google.com/google-ads/answer/13262500

    // If your site doesn't collect one of those fields, remove the field entirely rather than leaving it blank
    Object.keys(userData.address).forEach(key => userData.address[key] === undefined && delete userData.address[key])
    if(
        userData.address.first_name === undefined
        || userData.address.last_name === undefined
        || userData.address.postal_code === undefined
        || userData.address.country === undefined
    ) {
        delete userData.address;
    }
    Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key])

    // The phone number must be in E.164 format, which means it must be 11 to 15 digits including a plus sign (+) prefix and country code with no dashes, brackets or spaces.
    if(!/\+[0-9]{11,15}/.test(userData.phone_number)) {
        delete userData.phone_number
    }

    // As a reminder, at least one of the following fields must be provided:
    //  Email (preferred)
    //  Address (first name, last name, postal code, and country are required)
    //  A phone number can also be provided as a standalone match key but is recommended to be sent along with an email.
    if(!userData.email && !userData.address && !userData.phone_number) {
        return;
    }

    dataLayer.push([
        'set',
        'user_data',
        userData
    ])
}
