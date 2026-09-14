import ProductCard from './ProductCard'
import { totalForProduct } from '../lib/cart'

/**
 * A titled block of products for one type of goods.
 * Grid: 2 columns on phones, 3 on tablets, 4 on desktop.
 */
export default function CategorySection({ category, quantities, onAdd, onRemove }) {
  return (
    <section id={category.id} aria-labelledby={`${category.id}-heading`} className="scroll-mt-36">
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <div>
          <h2
            id={`${category.id}-heading`}
            className="font-display text-xl font-semibold text-ink sm:text-2xl"
          >
            {category.name}
          </h2>
          {category.blurb && <p className="mt-0.5 text-sm text-ink-soft">{category.blurb}</p>}
        </div>
        <p className="shrink-0 text-sm text-ink-soft">
          {category.products.length} item{category.products.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={totalForProduct(quantities, product.id)}
            onAdd={() => onAdd(product)}
            onRemove={() => onRemove(product)}
          />
        ))}
      </div>
    </section>
  )
}
