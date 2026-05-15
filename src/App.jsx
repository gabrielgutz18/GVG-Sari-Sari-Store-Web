import './App.css'

function App() {
  return (
    <>
      <div className="header-wrapper">
        <header className="header-container">
          <div className="header-logo-section">
            <h1 className="header-logo">
              GVG Store<span className="header-logo-dot">.</span>
            </h1>
          </div>
          
          <nav className="header-nav">
            <a href="/home">Home</a>
            <a href="/store">Store</a>
            <a href="/order">Order</a>
            <a href="/contact">Contact</a>
            <a href="/about">About</a>
          </nav>

          <div className="header-actions">
            <div className="header-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Search..." />
            </div>
            
            <button className="header-menu-btn">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>
      </div>
      <section className="hero-section" aria-label="hero panel">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to GVG Store
          </h1>
          <p className="hero-description">
            Your one-stop shop for all your Food Needs. Explore our wide selection of Snacks, Beverages, Ingredients, and etc.
          </p>
          <button className="hero-btn">Shop Now</button>
        </div>
      </section>

      <section className="home" aria-label="home panel">
        <h2 className="home-title">Featured Products</h2>
        <div className="home-products">
          <div className="home-product-card">
            <img src="/assets/product1.jpg" alt="Product 1" className="home-product-image" />
            <h3 className="home-product-name">Product 1</h3>
            <p className="home-product-price">$19.99</p>
          </div>
          <div className="home-product-card">
            <img src="/assets/product2.jpg" alt="Product 2" className="home-product-image" />
            <h3 className="home-product-name">Product 2</h3>
            <p className="home-product-price">$29.99</p>
          </div>
          <div className="home-product-card">
            <img src="/assets/product3.jpg" alt="Product 3" className="home-product-image" />
            <h3 className="home-product-name">Product 3</h3>
            <p className="home-product-price">$39.99</p>
          </div>
        </div>
      </section>
      
        
      
    </>
  )
}

export default App