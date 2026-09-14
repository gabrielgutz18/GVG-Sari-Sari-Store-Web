import { useState } from 'react'
import {
  ArrowLeftIcon,
  CartIcon,
  ImagePlaceholderIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from './Icon'
import { currency, store } from '../data/store'

/**
 * "My Cart" -- review the order, then say who it is for and how they want it.
 * Validation is inline and sits next to the field it belongs to.
 */
export default function CartPage({
  items,
  subtotal,
  onAdd,
  onRemove,
  onDelete,
  onContinueShopping,
  onPlaceOrder,
}) {
  const [customer, setCustomer] = useState({
    name: '',
    service: 'Pick up',
    address: '',
    note: '',
  })
  const [errors, setErrors] = useState({})

  const isDelivery = customer.service === 'Delivery'
  const deliveryFee = isDelivery ? store.deliveryFee : 0
  const total = subtotal + deliveryFee

  function update(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }))
    //  Clear the error as soon as the customer starts fixing it.
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    if (!customer.name.trim()) {
      nextErrors.name = 'Pakilagay ang pangalan para alam namin kung kanino ang order.'
    }
    if (isDelivery && !customer.address.trim()) {
      nextErrors.address = 'Kailangan ng address para sa delivery.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      //  Move focus to the first problem instead of only colouring it red.
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }

    onPlaceOrder({ ...customer, deliveryFee })
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-md rounded-xl border border-line bg-surface p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-canvas text-ink-soft">
            <CartIcon width={26} height={26} />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">Wala pa sa cart</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Pumili muna ng items sa tindahan, tapos babalik ka dito para sa resibo.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
          >
            Browse the store
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={onContinueShopping}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:text-brand"
      >
        <ArrowLeftIcon width={16} height={16} />
        Continue shopping
      </button>

      <h1 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">My Cart</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length} product{items.length === 1 ? '' : 's'} sa listahan mo.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ---------------- Line items ---------------- */}
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-canvas">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    width="80"
                    height="80"
                    className="h-full w-full object-contain p-1.5"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-line">
                    <ImagePlaceholderIcon width={26} height={26} />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-base font-semibold text-ink">
                      {item.baseName}
                    </h2>
                    {item.variant && (
                      <p className="mt-0.5 inline-block rounded bg-canvas px-1.5 py-0.5 text-xs font-semibold text-ink">
                        {item.variant.name}
                      </p>
                    )}
                    <p className="text-xs text-ink-soft">
                      {item.categoryName}
                      {item.unit ? ` · ${item.unit}` : ''}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {currency.format(item.price)} each
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-base font-bold text-gold">
                    {currency.format(item.subtotal)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-line p-1">
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                      aria-label={`Remove one ${item.name}`}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-ink-soft transition-colors duration-200 hover:bg-canvas hover:text-ink"
                    >
                      <MinusIcon width={16} height={16} />
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold text-ink">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                      aria-label={`Add one more ${item.name}`}
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-ink-soft transition-colors duration-200 hover:bg-canvas hover:text-ink"
                    >
                      <PlusIcon width={16} height={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:text-brand"
                  >
                    <TrashIcon width={15} height={15} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------------- Order details ---------------- */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-line bg-surface p-4 sm:p-5 lg:sticky lg:top-36"
        >
          <h2 className="font-display text-lg font-semibold text-ink">Order details</h2>

          <div className="mt-4 space-y-4">
            <Field
              id="name"
              label="Pangalan mo"
              required
              error={errors.name}
              value={customer.name}
              onChange={(value) => update('name', value)}
              autoComplete="name"
              placeholder="Juan Dela Cruz"
            />

            <fieldset>
              <legend className="text-sm font-semibold text-ink">Paano kukunin?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Pick up', 'Delivery'].map((option) => {
                  const isActive = customer.service === option
                  return (
                    <label
                      key={option}
                      className={[
                        'flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors duration-200',
                        isActive
                          ? 'border-brand bg-brand-soft text-brand'
                          : 'border-line text-ink-soft hover:border-ink-soft',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={option}
                        checked={isActive}
                        onChange={() => update('service', option)}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {isDelivery && (
              <Field
                id="address"
                label="Delivery address"
                required
                error={errors.address}
                value={customer.address}
                onChange={(value) => update('address', value)}
                autoComplete="street-address"
                placeholder="Blk 4 Lot 2, Brgy. San Roque"
                multiline
              />
            )}

            <Field
              id="note"
              label="Note (optional)"
              hint="Halimbawa: oras ng pick up, o palit kung ubos."
              value={customer.note}
              onChange={(value) => update('note', value)}
              multiline
            />
          </div>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-semibold text-ink">{currency.format(subtotal)}</dd>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery fee</dt>
                <dd className="font-semibold text-ink">{currency.format(deliveryFee)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-display text-base font-semibold text-ink">Total</dt>
              <dd className="font-display text-lg font-bold text-gold">{currency.format(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="mt-5 h-12 w-full cursor-pointer rounded-lg bg-brand text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
          >
            Place Order
          </button>

          <p className="mt-3 text-xs text-ink-soft">
            Gagawa ito ng resibo na pwede mong i-save at ipadala sa amin. Walang bayad na
            kinokolekta dito sa website.
          </p>
        </form>
      </div>
    </div>
  )
}

/** Label is always visible -- a placeholder on its own is not a label. */
function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  multiline = false,
  ...rest
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="text-brand" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="mt-0.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}

      <Tag
        id={id}
        value={value}
        required={required}
        rows={multiline ? 2 : undefined}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={[
          'mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink transition-colors duration-200 placeholder:text-ink-soft/50',
          multiline ? 'min-h-20 resize-y' : 'h-11',
          error ? 'border-brand' : 'border-line hover:border-ink-soft',
        ].join(' ')}
        {...rest}
      />

      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-semibold text-brand">
          {error}
        </p>
      )}
    </div>
  )
}
