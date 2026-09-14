// ---------------------------------------------------------------------------
// CART KEYS
//
// The cart is a plain `{ key: quantity }` map. Without flavors the key is just
// the product id, so nothing about the existing cart changes. With flavors,
// each one is its own line -- Piatos Cheese and Piatos BBQ are two different
// things to pack -- so the key carries the flavor too:
//
//      'piatos'                ->  Piatos, no flavor chosen
//      'piatos::spicy-cheese'  ->  Piatos, Spicy Cheese
//
// '::' is safe as the separator: product and option ids are words, dashes and
// spaces, never colons.
// ---------------------------------------------------------------------------

const SEPARATOR = '::'

export function cartKey(productId, variantId) {
  return variantId ? `${productId}${SEPARATOR}${variantId}` : productId
}

export function splitCartKey(key) {
  const at = key.indexOf(SEPARATOR)
  if (at === -1) return { productId: key, variantId: null }
  return { productId: key.slice(0, at), variantId: key.slice(at + SEPARATOR.length) }
}

//  How many of a product are in the cart, counting every flavor of it. The
//  tiles show one badge per product, not one per flavor -- "3 Piatos" is what
//  the customer remembers putting in, not "1 BBQ and 2 Cheese".
export function totalForProduct(quantities, productId) {
  return Object.entries(quantities).reduce(
    (sum, [key, quantity]) =>
      splitCartKey(key).productId === productId ? sum + quantity : sum,
    0,
  )
}
