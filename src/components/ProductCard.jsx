import { Link } from 'react-router-dom'
import { CheckIcon, ImagePlaceholderIcon, MinusIcon, PlusIcon } from './Icon'
import { currency } from '../data/store'

/**
 * One product tile.
 *
 * The whole tile opens the product page. That is one link, not several: the
 * name is the anchor and its ::after overlay stretches across the card, so a
 * screen reader hears "Piatos, link" once while a mouse can hit anywhere. The
 * cart controls sit above the overlay on their own z-index and keep working.
 *
 * Two states for the action, never both:
 *   qty === 0  ->  a single full-width "Add to Cart" button
 *   qty  >  0  ->  a stepper, tinted green so "already in my cart" is
 *                  readable at a glance without relying on colour alone
 *                  (a check icon + the count carry the same meaning).
 *
 * A product with flavors gets neither: there is nothing sensible to add or
 * remove until someone says which flavor, so the tile sends them to the page
 * to choose.
 */
export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  const inCart = quantity > 0
  const hasVariants = Boolean(product.variants)
  const href = `/product/${encodeURIComponent(product.id)}`

  return (
    <article
      className={[
        'relative flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors duration-200',
        inCart ? 'border-fresh' : 'border-line hover:border-ink-soft/40',
      ].join(' ')}
    >
      {/* Fixed 1:1 box reserves the space before any photo loads (no layout shift). */}
      <div className="relative aspect-square w-full bg-canvas">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width="600"
            height="600"
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-line">
            <ImagePlaceholderIcon />
            <span className="px-2 text-center text-[11px] font-semibold text-ink-soft">
              Photo soon
            </span>
          </div>
        )}

        {inCart && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-fresh px-2 py-1 text-[11px] font-bold text-white">
            <CheckIcon width={12} height={12} />
            {quantity}
          </span>
        )}

        {hasVariants && (
          <span className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-[11px] font-bold text-white">
            {product.variants.options.length} {product.variants.label.toLowerCase()}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex-1">
          <h3 className="font-display text-base leading-tight font-semibold text-ink">
            <Link
              to={href}
              className="after:absolute after:inset-0 after:content-[''] hover:text-brand"
            >
              {product.name}
            </Link>
          </h3>
          {product.unit && <p className="mt-0.5 text-xs text-ink-soft">{product.unit}</p>}
        </div>

        <p className="font-display text-lg font-bold text-gold">
          {product.priceFrom === product.priceTo
            ? currency.format(product.price)
            : `${currency.format(product.priceFrom)}+`}
        </p>

        {/* z-10 lifts the controls out from under the card-wide link overlay. */}
        <div className="relative z-10">
          {hasVariants ? (
            <Link
              to={href}
              className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-brand bg-brand-soft text-sm font-bold text-brand transition-colors duration-200 hover:bg-brand hover:text-white"
            >
              Pumili ng {product.variants.label.toLowerCase()}
            </Link>
          ) : inCart ? (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-fresh-line bg-fresh-soft p-1">
              <StepperButton
                onClick={onRemove}
                label={`Remove one ${product.name}`}
                icon={<MinusIcon width={18} height={18} />}
              />
              <span
                className="min-w-8 text-center font-display text-base font-bold text-fresh"
                aria-live="polite"
              >
                {quantity}
              </span>
              <StepperButton
                onClick={onAdd}
                label={`Add one more ${product.name}`}
                icon={<PlusIcon width={18} height={18} />}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${product.name} to cart`}
              className="h-11 w-full cursor-pointer rounded-lg bg-brand text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
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
