# GVG Store

Static storefront for a mini grocery / sari-sari store. React 19 + Vite + Tailwind 4.

No database, no accounts, no payments. The customer builds an order in the
browser, the site generates a receipt image, and they send that image to the
store on Facebook or by text. Nothing is stored anywhere.

```bash
npm install
npm run dev
```

---

## The two files you will actually edit

### 1. `src/data/store.js` — contact details

Fill these in when you have them. Any field left as `''` is hidden from the
site automatically, so nothing looks broken in the meantime.

| Field | Example | Used for |
| --- | --- | --- |
| `facebookUrl` | `https://www.facebook.com/juana.dela.cruz` | "Send receipt" button + footer |
| `facebookName` | `Nanay Juana` | Label on that button |
| `mobile` | `0917 123 4567` | Shown in header, footer, receipt |
| `mobileDial` | `+639171234567` | The `tel:` / `sms:` link |
| `address` | `123 Mabini St., Brgy. San Roque` | Pick-up address + receipt header |
| `hours` | `Monday to Sunday, 7:00 AM - 9:00 PM` | Hero, FAQ, footer |
| `deliveryFee` | `50` | Added at checkout; the row is hidden when `0` |

### 2. `src/data/products.js` — the goods

Seven categories, matching the folders in `src/assets/`:

| Category | Folder |
| --- | --- |
| Snacks | `src/assets/snacks/` |
| Junk Foods | `src/assets/junkfoods/` |
| Drinks | `src/assets/drinks/` |
| Frozen Goods | `src/assets/frozenGoods/` |
| Condiments | `src/assets/condiments/` |
| Canned Goods | `src/assets/cannedGoods/` |
| Cheese | `src/assets/cheese/` |

Photos are wired up **by filename** — `products.js` globs the asset folders at
build time, so there is no import to add and no list to keep in sync. Name the
file after the product id and drop it in the matching folder:

```
{ id: 'cream-o', name: 'Cream-O', price: 55 }
   ->  src/assets/snacks/cream-o.png
```

Accepted extensions: `.png` `.jpg` `.jpeg` `.webp` `.avif`. A product with no
matching file keeps the neutral "Photo soon" placeholder, so photos can land
one at a time. The card's photo box is a fixed aspect ratio, so adding one
never shifts the layout.

> **Keep ids lowercase-with-dashes.** The photo lookup is an exact string
> match on `<folder>/<id>`, so `{ id: 'Big Berta' }` needs a file literally
> named `Big Berta.png`. Every other product in the file uses kebab-case —
> staying consistent avoids photos silently failing to appear.

> **Export as WEBP where you can.** A 1000px PNG runs ~900KB; the same picture
> as WEBP is usually under 80KB. With 40+ products that is the difference
> between a fast shop and a slow one on mobile data.

Adding, renaming, removing products or whole categories is just editing this
array — the nav bar, the filters, the carousel and the cart all read from it.

### Extra photos (the gallery on the product page)

Make a folder named after the product id and drop more shots inside. They
become extra slides after the main photo, in filename order:

```
src/assets/junkfoods/piatos.png          ->  slide 1, and the tile photo
src/assets/junkfoods/piatos/2-back.png   ->  slide 2
src/assets/junkfoods/piatos/3-open.png   ->  slide 3
```

Nothing to register — same glob, same rules as the main photo.

### Flavors / variations

**Nothing has flavors yet.** No product carries a `variants` key, so every
product page shows one photo and one Add to Cart button. The code is already
there for when the store actually stocks them.

To turn flavors on for a product, add a `variants` block to it:

```js
{
  id: 'piatos',
  name: 'Piatos',
  price: 20,
  variants: {
    label: 'Flavor',                //  heading over the chips
    options: [
      { id: 'cheese', name: 'Cheese' },
      { id: 'bbq', name: 'BBQ' },
      { id: 'beef', name: 'Beef' },
      { id: 'spicy-cheese', name: 'Spicy Cheese', price: 22 },
      { id: 'sour-cream', name: 'Sour Cream' },
      { id: 'pizza', name: 'Pizza', available: false },
    ],
  },
}
```

Per option: `id` and `name` are required; `price` and `unit` override the
product's when this flavor differs; `available: false` greys the chip and
swaps Add to Cart for an "ubos muna" line — the flavor is still viewable,
just not orderable.

Each flavor's packaging is a file named after its option id, in the product's
folder:

```
src/assets/junkfoods/piatos/cheese.png
src/assets/junkfoods/piatos/bbq.png
```

That is all. Adding the block changes the rest of the shop on its own:

- the tile swaps Add to Cart for **Pumili ng flavor** and shows a `6 flavor`
  badge — there is nothing sensible to add until someone picks one
- the product page grows the chips, and the price follows the chosen flavor
- picking a flavor jumps the gallery to its photo, and stepping the gallery
  moves the chips — the picture and the price never disagree
- `?flavor=bbq` on the URL opens on that flavor, so a link can be sent as-is
- each flavor is **its own line in the cart and on the receipt** — Piatos
  Cheese and Piatos BBQ are two different things to pack
- a flavor with no photo yet falls back to the product's main one

### New Arrivals / Sale panel

The showcase under the hero is driven by one list at the bottom of
`products.js` — the product id plus the description shown beside the photo:

```js
export const FEATURED = [
  { id: 'hungarian-sausage', description: 'Makapal at malasa, sakto sa almusal...' },
  { id: 'cream-o', description: 'Malutong na biskwit na may creamy filling...' },
]
```

Add or remove entries to change what is featured; the order here is the order
on screen. An id that no longer matches a product is skipped rather than
breaking the panel, and an empty list hides the whole section.

The description is reused as the product's own blurb on its page, so there is
only one place to write it. The grid cards and the cart deliberately stay
short.

---

## How the order flow works

0. **New Arrivals / Sale** — a showcase panel under the hero: one featured item
   at a time, big photo on the left, item / price / description / add-to-cart
   stacked on the right, arrows at the right edge to step through. On phones it
   stacks and the arrows move below the content.

   It deliberately does *not* auto-rotate: the UX rule for auto-advancing
   content is that it needs prev/next *and* play-pause *and* it must stop on
   hover, on focus and under reduced-motion. A panel the customer drives needs
   none of that. Because only the current item is in the DOM, the arrows are
   real announced controls and a live region reports each change — stepping
   would otherwise be silent for screen readers.
1. **Shop** — browse all goods, or filter to one category from the nav bar.
2. **Product page** — tapping any tile opens the item on its own URL: gallery
   on the left, name / price / flavors / quantity on the right, then the
   description and the rest of that shelf. Add to Cart stays put; **Bilhin na**
   adds and goes straight to the cart.
3. **My Cart** — adjust quantities, enter name, pick Pick up / Delivery, add a note.
4. **Receipt** — auto-generated with a reference number, then:
   - **Save Receipt as Image** draws a PNG and downloads it
   - only *after* it saves does the **Send on Facebook** button unlock, because
     the customer needs the file in hand before opening Messenger

### Routing

Screens are real URLs (`react-router`), because a product page is worth sending
to someone:

| URL | Screen |
| --- | --- |
| `/` | the shop |
| `/?category=drinks` | the shop, filtered |
| `/product/piatos` | one product |
| `/product/piatos?flavor=bbq` | one product, on a flavor |
| `/cart` | the cart |
| `/receipt` | the receipt just generated |

The cart is deliberately **not** in the URL — it is a shopping trip, not a
document — so it lives in state and empties when the tab closes. For the same
reason `/receipt` sends you back to the shop on a refresh or a bookmark: there
is no server to fetch that order back from, and an empty page pretending to be
a receipt would be worse than the shop.

> **If you host this somewhere other than Vite:** deep links need the host to
> serve `index.html` for unknown paths (Netlify `_redirects`, Vercel rewrites,
> `try_files` on nginx). Without that, opening `/product/piatos` directly 404s
> even though it works fine from inside the site. `npm run dev` and
> `npm run preview` already do this.

The receipt image is drawn with the plain Canvas 2D API in
`src/lib/receiptImage.js` — no `html2canvas`, no extra dependency. The canvas is
allocated with slack and then cropped to wherever the ink actually ends, so the
receipt fits its content whether the order is one line or twenty.

---

## Design notes

Direction came from the `ui-ux-pro-max` skill (`--design-system`, variance 2 /
motion 2 / density 5): **Flat + Swiss-minimal**, which is why there are no
gradients, blurs, glass panels or floating shapes anywhere.

Tokens live in `@theme` in `src/index.css`:

- **Brand red** `#c81e1e` — the store's identity, used for actions
- **Fresh green** `#15803d` — reserved strictly for "in your cart" and success
- **Gold** `#a16207` — prices only
- Warm neutral canvas + white cards

Fonts are Fredoka (headings) and Nunito (body) — friendly rather than corporate.

**One thing to know if you edit `src/index.css`:** the base element styles are
inside `@layer base` on purpose. Unlayered CSS beats anything in a layer, so
moving `button { color: inherit }` out of that block will silently override
`.text-white` on every button.

Checked against the skill's pre-delivery checklist: all 13 text/background pairs
clear WCAG AA, every interactive target is ≥44×44, no horizontal scroll at
375px, visible focus rings throughout, and `prefers-reduced-motion` is honoured.

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the build
npm run lint     # eslint
```
