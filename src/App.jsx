import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import NewArrivals from './components/NewArrivals'
import CategorySection from './components/CategorySection'
import FAQ from './components/FAQ'
import ContactCard from './components/ContactCard'
import Footer from './components/Footer'
import Toast from './components/Toast'
import CartPage from './components/CartPage'
import ReceiptPage from './components/ReceiptPage'
import ProductPage from './components/ProductPage'
import { categories, featuredProducts, findProduct, findVariant } from './data/products'
import { cartKey, splitCartKey } from './lib/cart'
import { makeReceiptRef } from './lib/receiptImage'

/**
 * The whole shop is static -- no database, no accounts. Everything lives in
 * component state for the length of the visit, and the order leaves the site
 * as a receipt image the customer sends to the store themselves.
 *
 * Screens are real URLs (react-router), because a product page is worth
 * sending to someone: /product/piatos?flavor=bbq opens on that exact thing.
 * The cart is deliberately NOT in the URL -- it is a shopping trip, not a
 * document -- so it stays in state and empties when the tab closes.
 */
export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [quantities, setQuantities] = useState({})
  const [toast, setToast] = useState(null)
  const [order, setOrder] = useState(null)

  //  The category filter belongs in the URL: it is what the customer is
  //  looking at, so Back and a shared link both do the obvious thing.
  const activeCategory = searchParams.get('category') ?? 'all'
  const isShop = location.pathname === '/'

  // ---- Derived cart ------------------------------------------------------
  //  Keys are 'productId' or 'productId::flavorId'. A line whose product or
  //  flavor no longer exists in the catalog is dropped rather than rendered
  //  half-resolved -- the catalog is the source of truth, not the cart.
  const cartItems = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, quantity]) => quantity > 0)
        .map(([key, quantity]) => {
          const { productId, variantId } = splitCartKey(key)
          const product = findProduct(productId)
          if (!product) return null

          const variant = findVariant(product, variantId)
          if (variantId && !variant) return null

          const price = variant?.price ?? product.price
          return {
            ...product,
            key,
            variant,
            baseName: product.name,
            //  The receipt is packed by hand, so the flavor has to be part of
            //  the line's name, not a detail hidden in a field beside it.
            name: variant ? `${product.name} (${variant.name})` : product.name,
            image: variant?.image ?? product.image,
            unit: variant?.unit ?? product.unit ?? null,
            price,
            quantity,
            subtotal: price * quantity,
          }
        })
        .filter(Boolean),
    [quantities],
  )

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const visibleCategories = useMemo(
    () =>
      activeCategory === 'all'
        ? categories
        : categories.filter((category) => category.id === activeCategory),
    [activeCategory],
  )

  // ---- Cart actions ------------------------------------------------------
  //  A cart line handed back from the cart page already carries its own
  //  `variant`, so callers there can keep passing the item alone.
  const addItem = useCallback((product, variant = null, count = 1) => {
    const chosen = variant ?? product.variant ?? null
    const key = cartKey(product.id, chosen?.id)
    setQuantities((current) => ({ ...current, [key]: (current[key] ?? 0) + count }))
    setToast(`${chosen ? `${product.name} (${chosen.name})` : product.name} added to cart`)
  }, [])

  const removeItem = useCallback((product, variant = null) => {
    const chosen = variant ?? product.variant ?? null
    const key = cartKey(product.id, chosen?.id)
    setQuantities((current) => {
      const next = Math.max(0, (current[key] ?? 0) - 1)
      const updated = { ...current, [key]: next }
      if (next === 0) delete updated[key]
      return updated
    })
  }, [])

  const deleteItem = useCallback((product, variant = null) => {
    const chosen = variant ?? product.variant ?? null
    const key = cartKey(product.id, chosen?.id)
    setQuantities((current) => {
      const updated = { ...current }
      delete updated[key]
      return updated
    })
    setToast(`${product.name} removed`)
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  // ---- Navigation --------------------------------------------------------
  //  Each screen is a fresh page as far as the customer is concerned, so send
  //  them to the top rather than dropping them mid-scroll. Keyed on the path
  //  only: changing the flavor rewrites the query string, and that must not
  //  yank the page back to the top mid-choice.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  function handlePlaceOrder(customer) {
    setOrder({
      ref: makeReceiptRef(),
      date: new Date(),
      customer,
      items: cartItems,
      subtotal,
      deliveryFee: customer.deliveryFee,
      total: subtotal + customer.deliveryFee,
    })
    navigate('/receipt')
  }

  function handleNewOrder() {
    setQuantities({})
    setOrder(null)
    navigate('/')
  }

  function handleSelectCategory(categoryId) {
    navigate(categoryId === 'all' ? '/' : `/?category=${categoryId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        cartCount={cartCount}
        onOpenCart={() => navigate('/cart')}
        onGoHome={() => navigate('/')}
        showCategories={isShop}
      />

      <main id="main" className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <ShopPage
                visibleCategories={visibleCategories}
                quantities={quantities}
                onAdd={addItem}
                onRemove={removeItem}
              />
            }
          />

          <Route
            path="/product/:productId"
            element={
              <ProductRoute quantities={quantities} onAdd={addItem} onRemove={removeItem} />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                items={cartItems}
                subtotal={subtotal}
                onAdd={addItem}
                onRemove={removeItem}
                onDelete={deleteItem}
                onContinueShopping={() => navigate('/')}
                onPlaceOrder={handlePlaceOrder}
              />
            }
          />

          {/* A receipt only exists for the order just placed -- there is no
              server to fetch one back from, so a refresh or a bookmark goes
              to the shop instead of an empty page pretending to be a receipt. */}
          <Route
            path="/receipt"
            element={
              order ? (
                <ReceiptPage
                  order={order}
                  onBackToStore={() => navigate('/')}
                  onNewOrder={handleNewOrder}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  )
}

function ShopPage({ visibleCategories, quantities, onAdd, onRemove }) {
  return (
    <>
      <Hero
        onShopClick={() => document.getElementById('goods')?.scrollIntoView({ block: 'start' })}
      />

      <NewArrivals
        products={featuredProducts}
        quantities={quantities}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      <div id="goods" className="mx-auto w-full max-w-6xl scroll-mt-36 space-y-12 px-4 py-10 sm:px-6">
        {visibleCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            quantities={quantities}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}

        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-[1fr_340px] lg:items-start">
          <FAQ />
          <ContactCard />
        </div>
      </div>
    </>
  )
}

//  The lookup lives here rather than in ProductPage so the page component
//  takes a product and stays a pure view of one.
function ProductRoute({ quantities, onAdd, onRemove }) {
  const { productId } = useParams()
  //  Remounting on the id keeps the page honest: walking from one product to
  //  a related one starts on photo 1 with quantity 1, instead of inheriting
  //  the previous item's gallery position.
  return (
    <ProductPage
      key={productId}
      product={findProduct(productId)}
      quantities={quantities}
      onAdd={onAdd}
      onRemove={onRemove}
    />
  )
}

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface p-8 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">Wala dito ang page na yan</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Baka mali ang link. Sa tindahan ka na lang mamili.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
        >
          Browse the store
        </Link>
      </div>
    </div>
  )
}
