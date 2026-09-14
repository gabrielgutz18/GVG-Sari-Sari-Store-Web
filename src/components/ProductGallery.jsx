import { useRef } from 'react'
import { ArrowLeftIcon, ImagePlaceholderIcon } from './Icon'

/**
 * The photo half of the product page: one big shot, arrows to step through the
 * rest, and a thumbnail strip underneath.
 *
 * Controlled on purpose. The product page owns the index because picking a
 * flavor has to move the gallery and stepping the gallery has to move the
 * flavor chips -- two components each holding their own idea of "current"
 * would drift apart the moment one of them changed.
 *
 * With a single photo the arrows and thumbnails are not rendered at all,
 * rather than rendered disabled: there is nothing to step through, and a dead
 * control is worse than no control.
 */
export default function ProductGallery({ slides, index, onIndexChange, productName }) {
  const touchStartX = useRef(null)

  if (slides.length === 0) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-line bg-canvas text-line">
        <ImagePlaceholderIcon width={64} height={64} />
        <span className="text-sm font-semibold text-ink-soft">Photo soon</span>
      </div>
    )
  }

  const safeIndex = Math.min(index, slides.length - 1)
  const slide = slides[safeIndex]
  const hasMany = slides.length > 1

  const step = (delta) => onIndexChange((safeIndex + delta + slides.length) % slides.length)

  //  Swipe is the phone gesture people already expect from a shop listing.
  //  The arrows stay on screen for everyone else -- this is an addition, not
  //  the only way through the gallery.
  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return
    const travelled = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(travelled) > 45) step(travelled < 0 ? 1 : -1)
  }

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-surface"
        onTouchStart={hasMany ? handleTouchStart : undefined}
        onTouchEnd={hasMany ? handleTouchEnd : undefined}
      >
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.label ?? productName}
          width="800"
          height="800"
          className="h-full w-full animate-fade-in object-contain p-4 sm:p-6"
        />

        {hasMany && (
          <>
            <GalleryArrow onClick={() => step(-1)} label="Previous photo" side="left" />
            <GalleryArrow onClick={() => step(1)} label="Next photo" side="right" />

            <span className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-bold text-white">
              {safeIndex + 1} / {slides.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {slides.map((item, position) => {
            const isActive = position === safeIndex
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onIndexChange(position)}
                  aria-label={`Show photo ${position + 1}: ${item.label ?? productName}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={[
                    'grid h-16 w-16 cursor-pointer place-items-center overflow-hidden rounded-lg border bg-surface transition-colors duration-200',
                    isActive ? 'border-brand ring-1 ring-brand' : 'border-line hover:border-ink-soft/50',
                  ].join(' ')}
                >
                  <img
                    src={item.image}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* The arrows change the picture and nothing else; without this a screen
          reader hears a button press and no result. */}
      <p aria-live="polite" className="sr-only">
        Photo {safeIndex + 1} of {slides.length}: {slide.label ?? productName}
      </p>
    </div>
  )
}

function GalleryArrow({ onClick, label, side }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        'absolute top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-sm transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white',
        side === 'left' ? 'left-2' : 'right-2',
      ].join(' ')}
    >
      <ArrowLeftIcon width={18} height={18} className={side === 'right' ? 'rotate-180' : undefined} />
    </button>
  )
}
