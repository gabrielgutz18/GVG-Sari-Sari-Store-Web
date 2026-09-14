// ---------------------------------------------------------------------------
// PRODUCT CATALOG
//
// To add a real photo, drop the file into the matching folder under
// src/assets/<folder>/ and name it after the product id below:
//
//      src/assets/frozenGoods/tj-hotdog.png  ->  { id: 'tj-hotdog', ... }
//
// That is the whole step. Vite resolves the file at build time, so there is
// no import to add here and no list to keep in sync. A product with no
// matching file keeps the neutral "Photo soon" placeholder, so photos can
// land one at a time.
//
// EXTRA PHOTOS (the gallery on the product page)
// Make a folder named after the product id and drop more shots inside. They
// show up as extra slides, in filename order, after the main photo:
//
//      src/assets/junkfoods/piatos.png        -> slide 1 (also the tile photo)
//      src/assets/junkfoods/piatos/back.png   -> slide 2
//      src/assets/junkfoods/piatos/open.png   -> slide 3
//
// FLAVORS / VARIATIONS  --  see the block above `const catalog` below.
//
// Prices are in pesos. `unit` is the size/serving shown under the name.
// ---------------------------------------------------------------------------

// Every image under src/assets/, as { path: resolvedUrl }. The `**` covers
// both `<folder>/<id>.png` (the main photo) and `<folder>/<id>/<name>.png`
// (gallery + flavor photos).
const photos = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// '../assets/junkfoods/piatos.png'        -> 'junkfoods/piatos'
// '../assets/junkfoods/piatos/cheese.png' -> 'junkfoods/piatos/cheese'
const photoByKey = new Map(
  Object.entries(photos).map(([path, url]) => [
    path.replace('../assets/', '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

function photoFor(folder, id) {
  return photoByKey.get(`${folder}/${id}`) ?? null
}

//  Everything inside src/assets/<folder>/<id>/, as { name, image }, sorted by
//  filename so the owner controls the order by naming files 1-front, 2-back.
function extraPhotosFor(folder, id) {
  const prefix = `${folder}/${id}/`
  return [...photoByKey.entries()]
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, image]) => ({ name: key.slice(prefix.length), image }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
}

// ---------------------------------------------------------------------------
// FLAVORS / VARIATIONS
//
// Every product below has no flavors yet, which is why none of them carry a
// `variants` key -- the code reads that as `variants: null` and the product
// page simply shows one photo and one Add to Cart button.
//
// When the store actually stocks the flavors, add a `variants` block to that
// product and nothing else has to change. Piatos, as an example:
//
//      {
//        id: 'piatos',
//        name: 'Piatos',
//        price: 20,
//        variants: {
//          label: 'Flavor',                //  heading over the chips
//          options: [
//            { id: 'cheese', name: 'Cheese' },
//            { id: 'bbq', name: 'BBQ' },
//            { id: 'beef', name: 'Beef' },
//            { id: 'spicy-cheese', name: 'Spicy Cheese', price: 22 },
//            { id: 'sour-cream', name: 'Sour Cream' },
//            { id: 'pizza', name: 'Pizza', available: false },
//          ],
//        },
//      }
//
// Per option:
//   id         required, lowercase-with-dashes. Also the photo filename.
//   name       required, what the customer reads on the chip.
//   price      optional, pesos. Left out = same price as the product.
//   unit       optional, overrides the product's size line.
//   available  optional, `false` greys the chip out as "Out of stock".
//
// Each flavor's packaging photo is just a file named after the option id:
//
//      src/assets/junkfoods/piatos/cheese.png
//      src/assets/junkfoods/piatos/bbq.png
//
// Picking a flavor jumps the gallery to its photo, and stepping the gallery
// highlights the matching flavor. An option with no photo falls back to the
// product's main photo. Two flavors of the same product are two separate
// lines in the cart.
// ---------------------------------------------------------------------------

const catalog = [
  {
    id: 'snacks',
    name: 'Snacks',
    folder: 'snacks',
    blurb: 'Biscuits, crackers at pang-merienda.',
    products: [
      { id: 'skyflakes', name: 'Skyflakes', price: 42 },
      { id: 'fita', name: 'Fita', price: 65 },
      { id: 'rebisco', name: 'Rebisco', price: 55 },
      { id: 'hansel', name: 'Hansel', price: 65 },
      { id: 'cream-o', name: 'Cream-O', price: 75 },
      { id: 'inipit', name: 'Inipit', price: 15 },
    ],
  },
  {
    id: 'junkfoods',
    name: 'Junk Foods',
    folder: 'junkfoods',
    blurb: 'Chips at chichirya.',
    products: [
      { id: 'piatos', name: 'Piatos', price: 20 },
      { id: 'vcut', name: 'V-Cut', price: 20 },
      { id: 'nova', name: 'Nova', price: 20 },
      { id: 'clover', name: 'Clover Chips', price: 10 },
      { id: 'chippy', name: 'Chippy', price: 15 },
      { id: 'mr-chips', name: 'Mr. Chips', price: 15 },
      { id: 'Snakers', name: 'Snakers Nachos', price: 90 },
      { id: 'Berta', name: 'Big Berta', price: 100 },
      { id: 'snb', name: 'Nachos SNB', price: 100 },
      { id: 'Chipcharon', name: 'Chipcharon', price: 95 },
      { id: 'cheeseRings', name: 'Snakers Cheese Rings', price: 95 },
      { id: 'cheesePuffs', name: 'Snackers Cheese Puffs', price: 95 },

    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    folder: 'drinks',
    blurb: 'Malamig na inumin at kape.',
    products: [
      { id: 'cokemismo', name: 'Coke Mismo', price: 25 },
      { id: 'royalmismo', name: 'Royal Mismo', price: 25 },
      { id: 'spritemismo', name: 'Sprite Mismo', price: 25 },
    ],
  },
  {
    id: 'frozenGoods',
    name: 'Frozen Goods',
    folder: 'frozenGoods',
    blurb: 'Pang-ulam na frozen, sariwa sa freezer.',
    products: [
      { id: 'tj-hotdog', name: 'TJ Hotdog 10Pcs', price: 110 },
      { id: 'longganisaS', name: 'Sariaya Longganisa ', price: 120 },
      { id: 'jbpatties', name: 'JB Patties', price: 200 },
      { id: 'bonanza', name: 'Bonanza Coated Fries', price: 175 },
      { id: 'bigsiomai', name: 'Big Siomai 2 Packs', price: 170 },
      { id: 'lutosa', name: 'Lutosa Crickle Fries', price: 175 },
    ],
  },
  {
    id: 'condiments',
    name: 'Condiments',
    folder: 'condiments',
    blurb: 'Pampalasa para sa luto.',
    products: [
      { id: 'paminta', name: 'Paminta', price: 8 },
      { id: 'betsin', name: 'Betsin', price: 8 },
      { id: 'toyo', name: 'Toyo', price: 25 },
      { id: 'suka', name: 'Suka', price: 22 },
      { id: 'ketchup', name: 'Ketchup', price: 45 },
      { id: 'patis', name: 'Patis', price: 28 },
    ],
  },
  {
    id: 'cannedGoods',
    name: 'Canned Goods',
    folder: 'cannedGoods',
    blurb: 'De lata, pang-emergency ulam.',
    products: [
      { id: 'century-tuna', name: 'Century Tuna', price: 42 },
      { id: 'ligo-sardinas', name: 'Ligo Sardinas', price: 28 },
      { id: '555-sardines', name: '555 Sardines', price: 30 },
      { id: 'argentina-corned-beef', name: 'Argentina Corned Beef', price: 48 },
      { id: 'spam', name: 'Spam', price: 185 },
      { id: 'maling', name: 'Maling', price: 130 },
    ],
  },
  {
    id: 'cheese',
    name: 'Cheese',
    folder: 'cheese',
    blurb: 'Pang-palaman at pang-toppings.',
    products: [
      { id: 'eden-cheese', name: 'Eden Cheese', price: 65 },
      { id: 'cheez-whiz', name: 'Cheez Whiz', price: 95 },
      { id: 'magnolia-cheese', name: 'Magnolia Cheese', price: 78 },
      { id: 'quickmelt', name: 'Quickmelt', price: 92 },
      { id: 'quezoS', name: 'Daily Queso Small 3pcs', price: 105 },
      { id: 'quezoB', name: 'Daily Quesi Big', price: 92 },
    ],
  },
]

// ---------------------------------------------------------------------------
// NEW ARRIVALS / SALE  --  the showcase panel under the hero.
//
// One entry per featured item: the product id, plus the short description
// shown beside the photo. Order here is the order on screen. An id that no
// longer matches a product is skipped rather than breaking the panel, and an
// empty list hides the whole section.
//
// The same description is reused as the product's own blurb on its page, so
// there is only one place to write it.
// ---------------------------------------------------------------------------
export const FEATURED = [
  {
    id: 'hungarian-sausage',
    description: 'Makapal at malasa, sakto sa almusal o pang-ihaw. Tatlong piraso bawat pack.',
  },
  {
    id: 'cream-o',
    description: 'Malutong na biskwit na may creamy filling. Paborito ng mga bata pang-baon.',
  },
  {
    id: 'sting',
    description: 'Malamig na energy drink na pang-alis ng antok. Sakto sa mahabang biyahe.',
  },
  {
    id: 'cheez-whiz',
    description: 'Creamy na cheese spread. Pang-palaman sa tinapay, pandesal o crackers.',
  },
  {
    id: 'spam',
    description: 'Klasikong luncheon meat. Iprito lang at may ulam ka na agad.',
  },
  {
    id: 'chippy',
    description: 'Ang orihinal na barbecue corn chips. Pang-merienda habang nanonood.',
  },
  {
    id: 'patis',
    description: 'Puro at malinaw na patis. Pampalasa sa sinigang, nilaga at pang-sawsaw.',
  },
]

const descriptionById = new Map(FEATURED.map(({ id, description }) => [id, description]))

// ---------------------------------------------------------------------------
// Derived data -- nothing below here needs editing to add goods or photos.
// ---------------------------------------------------------------------------

//  A flavor chip, fully resolved: its own photo, price and size, falling back
//  to the product's whenever the option does not override them.
function buildVariants(product, folder) {
  const options = product.variants?.options ?? []
  if (options.length === 0) return null

  const mainImage = photoFor(folder, product.id)

  return {
    label: product.variants.label ?? 'Variation',
    options: options.map((option) => ({
      ...option,
      price: option.price ?? product.price,
      unit: option.unit ?? product.unit ?? null,
      image: photoFor(folder, `${product.id}/${option.id}`) ?? mainImage,
      //  Opt-out rather than opt-in: a flavor listed without a flag is one
      //  the store has, which is the common case.
      available: option.available !== false,
    })),
  }
}

//  The slides on the product page. With flavors, each flavor's packaging leads
//  in the order they are listed -- the page opens on a flavor, so that flavor's
//  photo has to be slide 1 or the picture and the price disagree about what is
//  on screen. The plain product shot and any other shots follow. Without
//  flavors it is simply the main photo and then the extras.
function buildGallery(product, folder, variants) {
  const mainImage = photoFor(folder, product.id)
  const variantIds = new Set(variants?.options.map((option) => option.id) ?? [])
  const slides = []

  for (const option of variants?.options ?? []) {
    if (!option.image) continue
    slides.push({
      id: `flavor-${option.id}`,
      image: option.image,
      label: `${product.name} - ${option.name}`,
      variantId: option.id,
    })
  }

  //  Skipped when a flavor with no photo of its own already fell back to it,
  //  rather than showing the same picture twice in a row.
  if (mainImage && !slides.some((slide) => slide.image === mainImage)) {
    slides.push({ id: 'main', image: mainImage, label: product.name, variantId: null })
  }

  for (const { name, image } of extraPhotosFor(folder, product.id)) {
    if (variantIds.has(name)) continue
    slides.push({ id: name, image, label: product.name, variantId: null })
  }

  return slides
}

function buildProduct(product, category) {
  const { folder } = category
  const variants = buildVariants(product, folder)
  const prices = variants ? variants.options.map((option) => option.price) : [product.price]

  return {
    ...product,
    variants,
    image: photoFor(folder, product.id),
    gallery: buildGallery(product, folder, variants),
    description: product.description ?? descriptionById.get(product.id) ?? null,
    //  Products with flavors can span a range of prices; the tile and the
    //  product page show "from" pricing when min and max differ.
    priceFrom: Math.min(...prices),
    priceTo: Math.max(...prices),
    categoryId: category.id,
    categoryName: category.name,
  }
}

export const categories = catalog.map((category) => ({
  ...category,
  products: category.products.map((product) => buildProduct(product, category)),
}))

//  Flat lookup: every product in the store, already resolved.
export const allProducts = categories.flatMap((category) => category.products)

export const featuredProducts = FEATURED.map(({ id }) => findProduct(id)).filter(Boolean)

export function findProduct(id) {
  return allProducts.find((product) => product.id === id)
}

//  Null for a product with no flavors, and null for a flavor that was removed
//  from the catalog after someone bookmarked or carted it -- callers treat
//  both the same way: fall back to the plain product.
export function findVariant(product, variantId) {
  if (!variantId || !product?.variants) return null
  return product.variants.options.find((option) => option.id === variantId) ?? null
}

//  Other goods from the same shelf, for the "You might also like" row.
export function relatedProducts(product, limit = 6) {
  if (!product) return []
  return allProducts
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, limit)
}
