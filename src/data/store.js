// ---------------------------------------------------------------------------
// STORE SETTINGS  --  edit this file, nothing else, to update contact details.
// Leave a value as an empty string ('') and the site simply hides that link.
// ---------------------------------------------------------------------------

export const store = {
  name: 'GVG Store',
  tagline: 'Mini grocery & sari-sari',
  //  Short line shown in the hero + on the receipt.
  blurb: 'Snacks, drinks, frozen goods at condiments — bilhin lang, ihahanda namin.',

  // -------------------------------------------------------------------------
  // FILL THESE IN LATER  (your mother's contact details)
  // -------------------------------------------------------------------------

  //  Full Facebook profile / page URL.
  //  Example: 'https://www.facebook.com/juana.dela.cruz'
  facebookUrl: '',

  //  Name shown on the "send receipt" button. Example: 'Nanay Juana'
  facebookName: '',

  //  Mobile number in the format you want customers to see.
  //  Example: '0917 123 4567'
  mobile: '',

  //  Same number, digits only, used for the tel: link. Example: '+639171234567'
  mobileDial: '',

  // -------------------------------------------------------------------------

  //  Where customers pick up. Example: '123 Mabini St., Brgy. San Roque'
  address: '',

  //  Store hours shown in the FAQ + footer.
  hours: 'Monday to Sunday, 7:00 AM - 9:00 PM',

  //  Set to 0 for no delivery fee. The row is hidden on the receipt when 0.
  deliveryFee: 0,

  //  Minimum order before delivery is offered. 0 disables the notice.
  deliveryMinimum: 0,
}

export const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})
