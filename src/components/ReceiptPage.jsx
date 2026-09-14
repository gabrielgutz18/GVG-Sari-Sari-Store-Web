import { useState } from 'react'
import { ArrowLeftIcon, CheckIcon, DownloadIcon, FacebookIcon, PhoneIcon } from './Icon'
import { currency, store } from '../data/store'
import { downloadBlob, formatReceiptDate, renderReceipt } from '../lib/receiptImage'

/**
 * Auto-generated receipt.
 *
 * Step 1  save the receipt as an image
 * Step 2  the "send it to the store" buttons unlock, because the whole point
 *         is that the customer has the file in hand before they open Messenger
 */
export default function ReceiptPage({ order, onBackToStore, onNewOrder }) {
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [preview, setPreview] = useState(null)

  const isSaved = status === 'saved'

  async function handleSave() {
    setStatus('saving')
    try {
      const { blob, dataUrl, fileName } = await renderReceipt(order)
      downloadBlob(blob, fileName)
      setPreview({ dataUrl, fileName })
      setStatus('saved')
    } catch (error) {
      console.error('Could not build the receipt image', error)
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <button
        type="button"
        onClick={onBackToStore}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:text-brand"
      >
        <ArrowLeftIcon width={16} height={16} />
        Back to store
      </button>

      {/* ---- Confirmation banner ---- */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-fresh-line bg-fresh-soft p-4">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fresh text-white">
          <CheckIcon width={18} height={18} />
        </span>
        <div>
          <h1 className="font-display text-lg font-semibold text-ink">Nagawa na ang resibo mo</h1>
          <p className="mt-1 text-sm text-ink-soft">
            I-save muna ito bilang larawan, tapos ipadala sa amin. Hindi pa kumpirmado ang order
            hangga&rsquo;t hindi kami nakakasagot.
          </p>
        </div>
      </div>

      {/* ---- Receipt ---- */}
      <article className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
        <header className="border-b border-dashed border-line px-5 py-6 text-center">
          <h2 className="font-display text-xl font-bold tracking-wide text-ink uppercase">
            {store.name}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{store.tagline}</p>
          {store.mobile && <p className="text-sm text-ink-soft">{store.mobile}</p>}
          {store.address && <p className="text-sm text-ink-soft">{store.address}</p>}
        </header>

        <dl className="space-y-1.5 border-b border-dashed border-line px-5 py-4 text-sm">
          <MetaRow label="Receipt No." value={<span className="font-mono">{order.ref}</span>} />
          <MetaRow label="Date" value={formatReceiptDate(order.date)} />
          <MetaRow label="Customer" value={order.customer.name} />
          <MetaRow label="Type" value={order.customer.service} />
          {order.customer.service === 'Delivery' && order.customer.address && (
            <MetaRow label="Address" value={order.customer.address} />
          )}
        </dl>

        <div className="px-5 py-4">
          <div className="flex justify-between border-b border-line pb-2 text-xs font-bold tracking-wide text-ink-soft uppercase">
            <span>Item</span>
            <span>Amount</span>
          </div>

          <ul className="divide-y divide-line/70">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-4 py-2.5 text-sm">
                <span className="text-ink">
                  <span className="font-bold">{item.quantity}x</span> {item.name}
                  {item.unit && <span className="text-ink-soft"> ({item.unit})</span>}
                </span>
                <span className="shrink-0 font-semibold text-ink">
                  {currency.format(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="space-y-1.5 border-t border-dashed border-line px-5 py-4 text-sm">
          <MetaRow label="Subtotal" value={currency.format(order.subtotal)} />
          {order.deliveryFee > 0 && (
            <MetaRow label="Delivery fee" value={currency.format(order.deliveryFee)} />
          )}
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
            <dt className="font-display text-base font-bold text-ink">TOTAL</dt>
            <dd className="font-display text-xl font-bold text-gold">
              {currency.format(order.total)}
            </dd>
          </div>
        </dl>

        {order.customer.note && (
          <div className="border-t border-dashed border-line px-5 py-4">
            <h3 className="text-xs font-bold tracking-wide text-ink-soft uppercase">Note</h3>
            <p className="mt-1 text-sm text-ink">{order.customer.note}</p>
          </div>
        )}
      </article>

      {/* ---- Step 1: save ---- */}
      <section aria-labelledby="save-heading" className="mt-6">
        <h2 id="save-heading" className="font-display text-base font-semibold text-ink">
          1. I-save ang resibo
        </h2>

        <button
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          <DownloadIcon width={18} height={18} />
          {status === 'saving'
            ? 'Ginagawa ang larawan...'
            : isSaved
              ? 'I-save ulit ang larawan'
              : 'Save Receipt as Image'}
        </button>

        <p aria-live="polite" className="mt-2 text-sm">
          {isSaved && (
            <span className="font-semibold text-fresh">
              Na-save na bilang {preview?.fileName}. Hanapin ito sa Downloads.
            </span>
          )}
          {status === 'error' && (
            <span className="font-semibold text-brand">
              Hindi nagawa ang larawan. Pwede mo na lang i-screenshot ang resibo sa itaas.
            </span>
          )}
        </p>

        {preview && (
          <figure className="mt-3">
            <img
              src={preview.dataUrl}
              alt="Preview of the saved receipt image"
              className="w-full max-w-sm rounded-lg border border-line"
            />
            <figcaption className="mt-1.5 text-xs text-ink-soft">
              Sa cellphone: pindutin nang matagal ang larawan para i-save sa gallery.
            </figcaption>
          </figure>
        )}
      </section>

      {/* ---- Step 2: send ---- */}
      <section aria-labelledby="send-heading" className="mt-6 border-t border-line pt-6">
        <h2 id="send-heading" className="font-display text-base font-semibold text-ink">
          2. Ipadala ang larawan sa amin
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {isSaved
            ? 'Buksan ang Facebook, tapos i-attach ang na-save na larawan sa message.'
            : 'I-save muna ang larawan sa itaas bago ito buksan.'}
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {store.facebookUrl ? (
            <a
              href={isSaved ? store.facebookUrl : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!isSaved}
              onClick={(event) => {
                if (!isSaved) event.preventDefault()
              }}
              className={[
                'inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition-colors duration-200',
                isSaved
                  ? 'cursor-pointer bg-[#1668D9] text-white hover:bg-[#1149A6]'
                  : 'cursor-not-allowed border border-line bg-canvas text-ink-soft/60',
              ].join(' ')}
            >
              <FacebookIcon width={18} height={18} />
              Send to {store.facebookName || store.name} on Facebook
            </a>
          ) : (
            <p className="rounded-lg border border-dashed border-line bg-canvas px-4 py-3 text-sm text-ink-soft">
              Facebook link is not set yet. Add it to{' '}
              <code className="font-mono text-xs text-ink">src/data/store.js</code> and this button
              appears here.
            </p>
          )}

          {store.mobile && (
            <a
              href={store.mobileDial ? `sms:${store.mobileDial}` : `tel:${store.mobile}`}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-surface px-6 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
            >
              <PhoneIcon width={18} height={18} />
              Text {store.mobile}
            </a>
          )}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={onNewOrder}
          className="inline-flex h-12 cursor-pointer items-center rounded-lg border border-line bg-surface px-6 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
        >
          Start a new order
        </button>
      </div>
    </div>
  )
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  )
}
