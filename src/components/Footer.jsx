import { FacebookIcon, PhoneIcon, StoreIcon } from './Icon'
import { store } from '../data/store'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* ---- Store ---- */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
                <StoreIcon width={20} height={20} />
              </span>
              <span className="font-display text-base font-semibold text-ink">{store.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{store.blurb}</p>
            <p className="mt-3 text-sm text-ink-soft">{store.hours}</p>
            {store.address && <p className="mt-1 text-sm text-ink-soft">{store.address}</p>}
          </div>

          {/* ---- Contact ---- */}
          <div>
            <h2 className="font-display text-sm font-bold tracking-wide text-ink uppercase">
              Contact
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {store.mobile ? (
                <li>
                  <a
                    href={store.mobileDial ? `tel:${store.mobileDial}` : undefined}
                    className="inline-flex cursor-pointer items-center gap-2 text-ink-soft transition-colors duration-200 hover:text-brand"
                  >
                    <PhoneIcon width={16} height={16} />
                    {store.mobile}
                  </a>
                </li>
              ) : (
                <li className="text-ink-soft/60">Mobile number: to follow</li>
              )}

              {store.facebookUrl ? (
                <li>
                  <a
                    href={store.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex cursor-pointer items-center gap-2 text-ink-soft transition-colors duration-200 hover:text-brand"
                  >
                    <FacebookIcon width={16} height={16} />
                    {store.facebookName || 'Facebook'}
                  </a>
                </li>
              ) : (
                <li className="text-ink-soft/60">Facebook page: to follow</li>
              )}
            </ul>
          </div>

          {/* ---- Terms ---- */}
          <div>
            <h2 className="font-display text-sm font-bold tracking-wide text-ink uppercase">
              Terms
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>
                Prices and stock shown here are a guide only and may change without notice. Ang
                huling presyo ay ang nasa tindahan.
              </li>
              <li>
                An order is confirmed only after we reply to your message. Sending a receipt does
                not reserve stock on its own.
              </li>
              <li>
                No payment is collected on this website. Bayad ay cash o GCash sa pick up o
                delivery.
              </li>
              <li>
                Frozen and chilled goods are non-returnable once they leave the store, except for
                items that are spoiled on hand-over.
              </li>
              <li>
                Details you type in the cart stay in your own browser. Walang account, walang
                database, walang naka-save sa amin.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {store.name}. All rights reserved.
          </p>
          <p>
            Product names and brand marks belong to their respective owners and are used here only
            to identify the goods on sale.
          </p>
        </div>
      </div>
    </footer>
  )
}
