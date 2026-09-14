import { CartIcon, PhoneIcon, StoreIcon } from './Icon'
import { store } from '../data/store'

/**
 * Sticky site header + category nav.
 *
 * Row 1: brand, phone (when filled in), cart button with live count.
 * Row 2: one nav item per type of goods, plus "All".
 */
export default function Navbar({
  categories,
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onGoHome,
  showCategories = true,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      {/* ---- Row 1: brand + actions ---- */}
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onGoHome}
          className="flex cursor-pointer items-center gap-2.5 rounded text-left"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white">
            <StoreIcon width={22} height={22} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-ink">{store.name}</span>
            <span className="block text-xs text-ink-soft">{store.tagline}</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {store.mobile && (
            <a
              href={store.mobileDial ? `tel:${store.mobileDial}` : undefined}
              className="hidden h-11 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-brand hover:text-brand sm:inline-flex"
            >
              <PhoneIcon width={16} height={16} />
              {store.mobile}
            </a>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={
              cartCount === 0
                ? 'My cart, empty'
                : `My cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`
            }
            className="relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
          >
            <CartIcon width={18} height={18} />
            <span className="hidden sm:inline">My Cart</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-extrabold text-brand">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* ---- Row 2: goods categories ---- */}
      {showCategories && (
        <nav aria-label="Product categories" className="border-t border-line bg-surface">
          <ul className="no-scrollbar mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
            <CategoryTab
              label="All"
              isActive={activeCategory === 'all'}
              onClick={() => onSelectCategory('all')}
            />
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                label={category.name}
                isActive={activeCategory === category.id}
                onClick={() => onSelectCategory(category.id)}
              />
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function CategoryTab({ label, isActive, onClick }) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-current={isActive ? 'true' : undefined}
        className={[
          'relative flex h-14 cursor-pointer items-center whitespace-nowrap px-3 text-sm transition-colors duration-200',
          isActive
            ? 'font-extrabold text-brand after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-brand'
            : 'font-semibold text-ink-soft hover:text-ink',
        ].join(' ')}
      >
        {label}
      </button>
    </li>
  )
}
