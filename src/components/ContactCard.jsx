import { FacebookIcon, PhoneIcon } from './Icon'
import { store } from '../data/store'

/**
 * Where to reach the store. Every value comes from src/data/store.js -- if a
 * field is still blank it shows a quiet "to follow" line instead of a dead
 * link, so the page never looks broken while the details are being filled in.
 */
export default function ContactCard() {
  const hasContact = Boolean(store.facebookUrl || store.mobile)

  return (
    <aside
      aria-labelledby="contact-heading"
      className="rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-36"
    >
      <h2 id="contact-heading" className="font-display text-lg font-semibold text-ink">
        Mag-message sa amin
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Para sa tanong tungkol sa stock, presyo, o delivery.
      </p>

      <div className="mt-4 space-y-2">
        {store.facebookUrl ? (
          <a
            href={store.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 cursor-pointer items-center gap-2.5 rounded-lg bg-[#1668D9] px-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1149A6]"
          >
            <FacebookIcon width={18} height={18} />
            {store.facebookName || 'Message on Facebook'}
          </a>
        ) : (
          <p className="rounded-lg border border-dashed border-line bg-canvas px-4 py-3 text-sm text-ink-soft">
            Facebook page: <span className="font-semibold">susunod</span>
          </p>
        )}

        {store.mobile ? (
          <a
            href={store.mobileDial ? `tel:${store.mobileDial}` : undefined}
            className="flex h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-line px-4 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
          >
            <PhoneIcon width={18} height={18} />
            {store.mobile}
          </a>
        ) : (
          <p className="rounded-lg border border-dashed border-line bg-canvas px-4 py-3 text-sm text-ink-soft">
            Mobile number: <span className="font-semibold">susunod</span>
          </p>
        )}
      </div>

      <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="font-semibold text-ink">Bukas</dt>
          <dd className="text-ink-soft">{store.hours}</dd>
        </div>
        {store.address && (
          <div>
            <dt className="font-semibold text-ink">Pick up</dt>
            <dd className="text-ink-soft">{store.address}</dd>
          </div>
        )}
      </dl>

      {!hasContact && (
        <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2.5 text-xs text-ink-soft">
          Para sa may-ari: ilagay ang Facebook link at mobile number sa{' '}
          <code className="font-mono text-ink">src/data/store.js</code>.
        </p>
      )}
    </aside>
  )
}
