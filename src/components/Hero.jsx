import { store } from '../data/store'

/**
 * Flat, quiet hero. No gradients, no blur, no floating shapes -- the job here
 * is to say what the store is and get people into the goods quickly.
 */
export default function Hero({ onShopClick }) {
  return (
    <section className="border-b border-line bg-brand-soft" aria-labelledby="hero-heading">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-extrabold tracking-[0.12em] text-brand uppercase">
          Open {store.hours.split(',')[0]}
        </p>

        <h1
          id="hero-heading"
          className="mt-2 max-w-xl font-display text-3xl leading-tight font-bold text-ink sm:text-4xl"
        >
          Order your grocery, ihahanda na namin.
        </h1>

        <p className="mt-3 max-w-lg text-base text-ink-soft">{store.blurb}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onShopClick}
            className="inline-flex h-12 cursor-pointer items-center rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
          >
            Start Shopping
          </button>
          <a
            href="#faq"
            className="inline-flex h-12 cursor-pointer items-center rounded-lg border border-brand-line bg-surface px-6 text-sm font-bold text-brand transition-colors duration-200 hover:bg-white"
          >
            How to Order
          </a>
        </div>

        <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-brand-line pt-5">
          <Fact term="Pick up" detail="Ready in ~15 min" />
          <Fact term="Delivery" detail="Nearby barangay" />
          <Fact term="Payment" detail="Cash or GCash" />
        </dl>
      </div>
    </section>
  )
}

function Fact({ term, detail }) {
  return (
    <div>
      <dt className="font-display text-sm font-semibold text-ink">{term}</dt>
      <dd className="mt-0.5 text-xs text-ink-soft">{detail}</dd>
    </div>
  )
}
