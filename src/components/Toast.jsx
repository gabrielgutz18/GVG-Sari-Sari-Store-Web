import { useEffect } from 'react'
import { CheckIcon } from './Icon'

/**
 * Brief confirmation after an item goes into the cart -- the UX rule is
 * "never a silent success". Announced politely so screen readers get it too,
 * and it never covers the cart button it refers to.
 */
export default function Toast({ message, onDismiss, duration = 2200 }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [message, onDismiss, duration])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      {message && (
        <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
          <CheckIcon width={16} height={16} className="text-fresh-line" />
          {message}
        </p>
      )}
    </div>
  )
}
