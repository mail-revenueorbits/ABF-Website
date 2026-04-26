import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { queryProducts, getCategories } from '../services/productService';
import ProductCard from '../components/shop/ProductCard';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const searchTimeout = useRef(null);
  const gridRef = useRef(null);

  // Read params
  const activeCategory = searchParams.get('category') || 'all';
  const activeSort = searchParams.get('sort') || 'popular';
  const activePage = parseInt(searchParams.get('page') || '1', 10);
  const activeSearch = searchParams.get('search') || '';

  // Update a single search param while preserving others
  const updateParam = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'all' || value === 'popular' || (key === 'page' && value === 1)) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        // Reset page when changing filters
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams]
  );

  // Load categories
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Load products whenever params change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    queryProducts({
      category: activeCategory,
      search: activeSearch,
      sort: activeSort,
      page: activePage,
      perPage: 12,
    }).then((result) => {
      if (cancelled) return;
      setProducts(result.products);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, activeSearch, activeSort, activePage]);

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      updateParam('search', value);
    }, 400);
  };

  const clearSearch = () => {
    setSearchInput('');
    updateParam('search', '');
  };

  // Scroll to top of grid on page change
  const handlePageChange = (page) => {
    updateParam('page', page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Build page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const activeCategoryName =
    activeCategory === 'all'
      ? 'All Products'
      : categories.find((c) => c.slug === activeCategory)?.name || 'All Products';

  return (
    <div className="shop-page">
      {/* Breadcrumbs */}
      <div className="shop-breadcrumbs container">
        <Link to="/">Home</Link>
        <span className="shop-breadcrumb-sep">/</span>
        <span>Shop</span>
        {activeCategory !== 'all' && (
          <>
            <span className="shop-breadcrumb-sep">/</span>
            <span>{activeCategoryName}</span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="shop-header container">
        <div className="shop-header-text">
          <h1 className="heading-1">{activeCategoryName}</h1>
          <p className="body-lg" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {total} {total === 1 ? 'product' : 'products'}
            {activeSearch && (
              <span>
                {' '}matching "<strong>{activeSearch}</strong>"
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="shop-layout container" ref={gridRef}>
        {/* Sidebar */}
        <aside className={`shop-sidebar ${mobileFiltersOpen ? 'shop-sidebar--open' : ''}`}>
          {/* Mobile close */}
          <div className="shop-sidebar-header">
            <h3 className="overline-lg">Filters</h3>
            <button
              className="shop-sidebar-close"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Search */}
          <div className="shop-search">
            <span className="material-symbols-outlined shop-search-icon">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
              className="shop-search-input"
            />
            {searchInput && (
              <button className="shop-search-clear" onClick={clearSearch} aria-label="Clear search">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  close
                </span>
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="shop-filter-group">
            <h4 className="shop-filter-title">Category</h4>
            <ul className="shop-filter-list">
              <li>
                <button
                  className={`shop-filter-btn ${activeCategory === 'all' ? 'shop-filter-btn--active' : ''}`}
                  onClick={() => updateParam('category', 'all')}
                >
                  All Products
                  <span className="shop-filter-count">
                    {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
                  </span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    className={`shop-filter-btn ${activeCategory === cat.slug ? 'shop-filter-btn--active' : ''}`}
                    onClick={() => updateParam('category', cat.slug)}
                  >
                    {cat.name}
                    <span className="shop-filter-count">{cat.productCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile filter overlay backdrop */}
          <div
            className="shop-sidebar-backdrop"
            onClick={() => setMobileFiltersOpen(false)}
          />
        </aside>

        {/* Main content */}
        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button
              className="shop-mobile-filter-btn"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                tune
              </span>
              <span>Filters</span>
            </button>

            <div className="shop-sort">
              <label htmlFor="sort-select" className="shop-sort-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={activeSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="shop-sort-select"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="shop-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pc-skeleton">
                  <div className="pc-skeleton-img skeleton-shimmer" />
                  <div className="pc-skeleton-text">
                    <div className="pc-skeleton-line skeleton-shimmer" style={{ width: '40%' }} />
                    <div className="pc-skeleton-line skeleton-shimmer" style={{ width: '70%' }} />
                    <div className="pc-skeleton-line skeleton-shimmer" style={{ width: '35%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }}
              >
                search_off
              </span>
              <h3 className="heading-3">No products found</h3>
              <p className="body-md" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Try adjusting your search or filters.
              </p>
              <button
                className="btn-outline-dark"
                style={{ marginTop: '24px' }}
                onClick={() => {
                  clearSearch();
                  updateParam('category', 'all');
                }}
              >
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="shop-pagination">
              <button
                className="shop-page-btn"
                disabled={activePage <= 1}
                onClick={() => handlePageChange(activePage - 1)}
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  chevron_left
                </span>
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  className={`shop-page-btn ${activePage === num ? 'shop-page-btn--active' : ''}`}
                  onClick={() => handlePageChange(num)}
                  aria-label={`Page ${num}`}
                  aria-current={activePage === num ? 'page' : undefined}
                >
                  {num}
                </button>
              ))}

              <button
                className="shop-page-btn"
                disabled={activePage >= totalPages}
                onClick={() => handlePageChange(activePage + 1)}
                aria-label="Next page"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  chevron_right
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
