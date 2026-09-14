import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckIcon, ImagePlaceholderIcon, MinusIcon, PlusIcon } from './Icon'
import { currency } from '../data/store'
import { totalForProduct } from '../lib/cart'

/**
 * "New Arrivals / Sale" -- one featured item at a time: big photo on the left,
 * item / price / description / add-to-cart stacked on the right, arrow on the
 * right edge to move to the next one.
 *
 * It does NOT auto-rotate. The UX rule for auto-advancing content is that it
 * needs prev/next AND play-pause AND it must stop on hover, on focus and under
 * reduced-motion. A panel the customer drives needs none of that.
 *
 * Unlike a scrolling strip, only the current item is in the DOM -- so the
 * arrows are real, announced controls here rather than decorative ones, and a
 * live region reports each change for screen readers.
 */
export default function NewArrivals({ products, quantities, onAdd, onRemove }) {
  const [index, setIndex] = useState(0)

  if (products.length === 0) return null

  //  Derived rather than corrected in an effect: if the featured list shrinks
  //  the stale index simply reads as the last item, and the next step() call
  //  normalises it via the modulo. No cascading render, no stale counter.
  const safeIndex = Math.min(index, products.length - 1)
  const product = products[safeIndex]
  const quantity = totalForProduct(quantities, product.id)
  const inCart = quantity > 0
  const hasVariants = Boolean(product.variants)
  const href = `/product/${encodeURIComponent(product.id)}`

  const step = (delta) =>
    setIndex((current) => {
      const from = Math.min(current, products.length - 1)
      return (from + delta + products.length) % products.length
    })

  return (
    <section aria-labelledby="new-arrivals-heading" className="scroll-mt-36 bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="relative rounded-xl border border-line bg-surface p-4 sm:p-6 md:pr-20">
          {/* ---- Title + controls ---- */}
          <div className="flex items-center justify-between gap-4">
            <h2
              id="new-arrivals-heading"
              className="font-display text-lg font-bold tracking-wide text-ink uppercase sm:text-xl"
            >
              New Arrivals / Sale
            </h2>

            <p className="shrink-0 text-sm font-semibold text-ink-soft md:hidden">
              {safeIndex + 1} / {products.length}
            </p>
          </div>

          {/* ---- Featured item ---- */}
          <div
            key={product.id}
            className="mt-4 grid animate-fade-in gap-5 md:grid-cols-[1.05fr_1fr] md:gap-8"
          >
            {/* Photo -- a link, because a big picture is the thing people
                reach for first when they want a closer look. */}
            <Link
              to={href}
              aria-label={`See details for ${product.name}`}
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-canvas transition-colors duration-200 hover:border-brand"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  width="800"
                  height="600"
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-line">
                  <ImagePlaceholderIcon width={56} height={56} />
                  <span className="text-xs font-semibold text-ink-soft">Photo soon</span>
                </div>
              )}

              {inCart && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-fresh px-2.5 py-1 text-xs font-bold text-white">
                  <CheckIcon width={13} height={13} />
                  {quantity} sa cart
                </span>
              )}
            </Link>

            {/* Item / price / description / add to cart */}
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-ink-soft">{product.categoryName}</p>

              <h3 className="mt-1 font-display text-2xl leading-tight font-bold text-ink sm:text-3xl">
                <Link to={href} className="transition-colors duration-200 hover:text-brand">
                  {product.name}
                </Link>
              </h3>

              <p className="mt-2 font-display text-3xl font-bold text-gold">
                {currency.format(product.price)}
              </p>

              {product.description && (
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {product.description}
                </p>
              )}

              {/* mt-auto pins the action to the bottom of the column, as drawn */}
              <div className="mt-6 md:mt-auto md:pt-6">
                {hasVariants ? (
                  <Link
                    to={href}
                    className="inline-flex h-12 w-full max-w-xs cursor-pointer items-center justify-center rounded-lg bg-brand text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
                  >
                    Pumili ng {product.variants.label.toLowerCase()}
                  </Link>
                ) : inCart ? (
                  <div className="flex max-w-xs items-center justify-between gap-2 rounded-lg border border-fresh-line bg-fresh-soft p-1">
                    <StepperButton
                      onClick={() => onRemove(product)}
                      label={`Remove one ${product.name}`}
                      icon={<MinusIcon width={18} height={18} />}
                    />
                    <span className="min-w-8 text-center font-display text-base font-bold text-fresh">
                      {quantity}
                    </span>
                    <StepperButton
                      onClick={() => onAdd(product)}
                      label={`Add one more ${product.name}`}
                      icon={<PlusIcon width={18} height={18} />}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdd(product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="h-12 w-full max-w-xs cursor-pointer rounded-lg bg-brand text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
                  >
                    Add to Cart
                  </button>
                )}

                <Link
                  to={href}
                  className="mt-3 inline-block text-sm font-semibold text-ink-soft underline-offset-4 transition-colors duration-200 hover:text-brand hover:underline"
                >
                  Tingnan ang details
                </Link>
              </div>
            </div>
          </div>

          {/* ---- Arrows ----
              In flow under the panel on phones, floated to the right edge and
              vertically centred from md up, which is where the sketch has it. */}
          <div className="mt-5 flex items-center justify-center gap-3 md:absolute md:top-1/2 md:right-4 md:mt-0 md:-translate-y-1/2 md:flex-col">
            <ArrowButton
              onClick={() => step(-1)}
              label="Show previous item"
              rotate={false}
              disabled={products.length < 2}
            />
            <p className="hidden text-xs font-semibold text-ink-soft md:block">
              {safeIndex + 1}/{products.length}
            </p>
            <ArrowButton
              onClick={() => step(1)}
              label="Show next item"
              rotate
              disabled={products.length < 2}
            />
          </div>

          {/* Screen readers get told what changed; the arrows alone would be silent. */}
          <p aria-live="polite" className="sr-only">
            Showing {safeIndex + 1} of {products.length}: {product.name},{' '}
            {currency.format(product.price)}
          </p>
        </div>
      </div>
    </section>
  )
}

function ArrowButton({ onClick, label, rotate, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg border border-line bg-surface text-ink transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white disabled:cursor-default disabled:border-line disabled:bg-surface disabled:text-ink-soft/30"
    >
      <ArrowLeftIcon width={20} height={20} className={rotate ? 'rotate-180' : undefined} />
    </button>
  )
}

function StepperButton({ onClick, label, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-md bg-surface text-fresh transition-colors duration-200 hover:bg-fresh hover:text-white"
    >
      {icon}
    </button>
  )
}
