import { currency } from '../data/store'

/**
 * The flavor / variation chips, Shopee-style.
 *
 * Renders nothing at all when the product has no `variants` block, which is
 * every product today. Adding flavors to a product in src/data/products.js is
 * the only thing needed to make this appear.
 *
 * A flavor that costs more than the others says so on the chip, because the
 * price above the chips changes when it is picked and a price that moves with
 * no explanation reads as a bug.
 *
 * A sold-out flavor is still selectable, only greyed. Picking it swaps in its
 * packaging photo and replaces Add to Cart with "ubos muna" -- which answers
 * "do you have Pizza?" properly. A disabled chip answers it by refusing to
 * respond at all.
 */
export default function VariantPicker({ variants, selectedId, onSelect, basePrice }) {
  if (!variants) return null

  const groupLabel = variants.label ?? 'Variation'

  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-semibold text-ink">
        {groupLabel}
        <span className="ml-2 font-normal text-ink-soft">
          {variants.options.length} to choose from
        </span>
      </legend>

      <div className="mt-2.5 flex flex-wrap gap-2">
        {variants.options.map((option) => {
          const isActive = option.id === selectedId
          const costsMore = option.price !== basePrice

          return (
            <label
              key={option.id}
              className={[
                'relative flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-200',
                isActive
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line text-ink hover:border-ink-soft',
                !option.available && 'opacity-55',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                type="radio"
                name={`variant-${groupLabel}`}
                value={option.id}
                checked={isActive}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />

              {option.image && (
                <img
                  src={option.image}
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                  className="h-7 w-7 shrink-0 rounded object-contain"
                />
              )}

              <span>
                {option.name}
                {costsMore && (
                  <span className="ml-1.5 font-normal text-ink-soft">
                    {currency.format(option.price)}
                  </span>
                )}
              </span>

              {!option.available && (
                <span className="ml-1 text-[11px] font-bold text-ink-soft uppercase">Ubos</span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
