import { ChevronDownIcon } from './Icon'
import { faqs } from '../data/faqs'

/**
 * Native <details> accordion -- keyboard accessible and works without JS.
 * The first item ("How to order?") is open by default because it is the one
 * thing a first-time customer actually needs.
 */
export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-36">
      <div className="mb-4 border-b border-line pb-3">
        <h2 id="faq-heading" className="font-display text-xl font-semibold text-ink sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-0.5 text-sm text-ink-soft">
          Mga madalas itanong tungkol sa pag-order.
        </p>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {faqs.map((faq, index) => (
          <details key={faq.id} name="faq" open={index === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-display text-base font-semibold text-ink hover:bg-canvas">
              {faq.question}
              <ChevronDownIcon className="shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4">
              <ol className="space-y-2 text-sm text-ink-soft">
                {faq.answer.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
