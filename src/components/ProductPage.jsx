import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon, CartIcon, CheckIcon, MinusIcon, PlusIcon, StoreIcon } from './Icon'
import ProductGallery from './ProductGallery'
import VariantPicker from './VariantPicker'
import ProductCard from './ProductCard'
import { findVariant, relatedProducts } from '../data/products'
import { cartKey, totalForProduct } from '../lib/cart'
import { currency, store } from '../data/store'

/**
 * The product page -- its own URL, so a link can be sent over Messenger and it
 * still opens on the right item.
 *
 *      /product/piatos                 the product
 *      /product/piatos?flavor=bbq      the product, on a flavor
 *
 * Two halves: the gallery on the left, and the name / price / flavors /
 * quantity / actions stacked on the right, which is the layout people already
 * know from Shopee and Lazada. Below them sit the description and the rest of
 * the same shelf.
 */
export default function ProductPage({ product, quantities, onAdd, onRemove }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [quantity, setQuantity] = useState(1)

  // ---- Which flavor is showing -------------------------------------------
  //  Held in the URL so the choice survives a refresh and a shared link, and
  //  falls back to the first one actually in stock. Preselecting means there
  //  is no "you forgot to pick a flavor" error to design around -- the page
  //  always shows a real price for a real thing.
  //
  //  All of this is read before the early return below, so the hook order
  //  stays the same whether the product was found or not.
  const slides = product?.gallery ?? []
  const options = product?.variants?.options ?? []
  const fallback = options.find((option) => option.available) ?? options[0] ?? null
  const selected = findVariant(product, searchParams.get('flavor')) ?? fallback
  const selectedId = selected?.id ?? null

  //  Opens on the chosen flavor's packaging rather than at slide 1, which for
  //  a shared ?flavor= link is the whole point of the link.
  const [galleryIndex, setGalleryIndex] = useState(() => {
    const at = slides.findIndex((slide) => slide.variantId === selectedId)
    return at === -1 ? 0 : at
  })

  if (!product) return <MissingProduct />

  const price = selected?.price ?? product.price
  const unit = selected?.unit ?? product.unit ?? null
  const soldOut = selected ? !selected.available : false
  const hasPriceRange = product.priceFrom !== product.priceTo
  const variationLabel = product.variants?.label ?? ''

  const inCart = quantities[cartKey(product.id, selectedId)] ?? 0
  const related = relatedProducts(product)

  function selectVariant(variantId) {
    setSearchParams({ flavor: variantId }, { replace: true })
    const at = slides.findIndex((slide) => slide.variantId === variantId)
    if (at !== -1) setGalleryIndex(at)
  }

  //  Stepping the gallery onto a flavor's packaging shot selects that flavor,
  //  the way a shop listing does -- the photo and the name should never
  //  disagree about which thing is on screen. That includes flavors the store
  //  has run out of: they are viewable, they just cannot be added.
  function handleGalleryIndex(next) {
    setGalleryIndex(next)
    const variantId = slides[next]?.variantId
    if (variantId && variantId !== selectedId) {
      setSearchParams({ flavor: variantId }, { replace: true })
    }
  }

  function handleAdd() {
    onAdd(product, selected, quantity)
    setQuantity(1)
  }

  function handleBuyNow() {
    onAdd(product, selected, quantity)
    navigate('/cart')
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* ---- Breadcrumb ---- */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-semibold text-ink-soft transition-colors duration-200 hover:text-brand"
        >
          <ArrowLeftIcon width={16} height={16} />
          Store
        </Link>
        <span aria-hidden className="text-line">
          /
        </span>
        <Link
          to={`/?category=${product.categoryId}`}
          className="font-semibold text-ink-soft transition-colors duration-200 hover:text-brand"
        >
          {product.categoryName}
        </Link>
        <span aria-hidden className="text-line">
          /
        </span>
        <span className="font-semibold text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* ---- Showcase ---- */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-10">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <ProductGallery
            slides={slides}
            index={galleryIndex}
            onIndexChange={handleGalleryIndex}
            productName={product.name}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">
            {product.categoryName}
          </p>

          <h1 className="mt-1 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
            {product.name}
          </h1>

          {selected && (
            <p className="mt-1 text-sm text-ink-soft">
              {variationLabel}: <span className="font-semibold text-ink">{selected.name}</span>
            </p>
          )}

          <div className="mt-4 rounded-xl bg-canvas px-4 py-3">
            <p className="font-display text-3xl font-bold text-gold">{currency.format(price)}</p>
            {unit && <p className="mt-0.5 text-sm text-ink-soft">{unit}</p>}
            {hasPriceRange && (
              <p className="mt-1 text-xs text-ink-soft">
                {currency.format(product.priceFrom)} - {currency.format(product.priceTo)} depende sa{' '}
                {variationLabel.toLowerCase()}
              </p>
            )}
          </div>

          <VariantPicker
            variants={product.variants}
            selectedId={selectedId}
            onSelect={selectVariant}
            basePrice={product.price}
          />

          {/* ---- Quantity + actions ---- */}
          <div className="mt-6">
            <p id="quantity-label" className="text-sm font-semibold text-ink">
              Ilan?
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1">
                <StepperButton
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  label="Bawasan ng isa"
                  disabled={quantity <= 1}
                  icon={<MinusIcon width={18} height={18} />}
                />
                <span
                  aria-live="polite"
                  aria-labelledby="quantity-label"
                  className="min-w-10 text-center font-display text-lg font-bold text-ink"
                >
                  {quantity}
                </span>
                <StepperButton
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                  label="Dagdagan ng isa"
                  disabled={quantity >= 99}
                  icon={<PlusIcon width={18} height={18} />}
                />
              </div>

              {inCart > 0 && (
                <p className="inline-flex items-center gap-1.5 rounded-full bg-fresh-soft px-3 py-1.5 text-sm font-semibold text-fresh">
                  <CheckIcon width={15} height={15} />
                  {inCart} nasa cart na
                </p>
              )}
            </div>

            {soldOut ? (
              <p className="mt-5 rounded-lg border border-line bg-canvas px-4 py-3 text-sm font-semibold text-ink-soft">
                Ubos muna ang {selected.name}. Pumili na lang ng ibang{' '}
                {variationLabel.toLowerCase()} sa taas.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-brand bg-brand-soft px-6 text-sm font-bold text-brand transition-colors duration-200 hover:bg-brand hover:text-white"
                >
                  <CartIcon width={18} height={18} />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
                >
                  Bilhin na
                </button>
              </div>
            )}
          </div>

          {/* ---- Description ---- */}
          <div className="mt-8 border-t border-line pt-6">
            <h2 className="font-display text-lg font-semibold text-ink">Tungkol dito</h2>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">
              {product.description ?? 'Available sa tindahan. Tanungin lang kung ilan ang stock.'}
            </p>

            <dl className="mt-4 grid gap-x-6 text-sm sm:grid-cols-2">
              <Detail label="Uri" value={product.categoryName} />
              {unit && <Detail label="Laki" value={unit} />}
              {product.variants && (
                <Detail
                  label={variationLabel}
                  value={product.variants.options.map((option) => option.name).join(', ')}
                />
              )}
              <Detail label="Bayad" value="Cash sa pick up o delivery" />
            </dl>
          </div>

          <p className="mt-5 flex items-start gap-2.5 rounded-lg border border-line bg-canvas px-4 py-3 text-sm text-ink-soft">
            <StoreIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand" />
            <span>
              Ipunin lang sa cart ang gusto mo, tapos gagawa kami ng resibo na ipapadala mo sa amin.
              Bukas kami {store.hours}.
            </span>
          </p>
        </div>
      </div>

      {/* ---- Related ---- */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-12 border-t border-line pt-8">
          <h2 id="related-heading" className="font-display text-xl font-semibold text-ink">
            Iba pang {product.categoryName}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                quantity={totalForProduct(quantities, item.id)}
                onAdd={() => onAdd(item)}
                onRemove={() => onRemove(item)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="flex gap-2 border-b border-line py-1.5">
      <dt className="shrink-0 font-semibold text-ink">{label}:</dt>
      <dd className="text-ink-soft">{value}</dd>
    </div>
  )
}

function StepperButton({ onClick, label, icon, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-md text-ink transition-colors duration-200 hover:bg-canvas disabled:cursor-default disabled:text-ink-soft/30 disabled:hover:bg-transparent"
    >
      {icon}
    </button>
  )
}

function MissingProduct() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">Wala kami niyan</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Baka naubos na o naiba ang link. Balik tayo sa listahan ng paninda.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
        >
          Browse the store
        </Link>
      </div>
    </div>
  )
}
