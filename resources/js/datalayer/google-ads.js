export const setUserData = async (userData = {
    email: window.app.user?.email || window.app.guestEmail,
    phone_number: window.app.checkout.billing_address.telephone.replaceAll(/[^0-9\+]*/g, ''),
    address: {
        first_name: window.app.checkout.billing_address.firstname,
        last_name: window.app.checkout.billing_address.lastname,
        street: window.app.checkout.billing_address.street.join("\n"),
        city: window.app.checkout.billing_address.city,
        postal_code: window.app.checkout.billing_address.postcode,
        country: window.app.checkout.billing_address.country_id,
    }
}) => {
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
