import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import ScrollToTop from './components/layout/ScrollToTop';
import { migrateAllProducts } from './utils/migrateProducts';
import './index.css';

// Lazy-load the entire admin panel so it doesn't bloat the public bundle
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'));
const BannersPage = lazy(() => import('./pages/admin/BannersPage'));
const BlogPage = lazy(() => import('./pages/admin/BlogPage'));
const InquiriesPage = lazy(() => import('./pages/admin/InquiriesPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));

function AdminFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'var(--font-body)',
      color: 'var(--text-muted)',
      fontSize: '14px',
    }}>
      Loading admin panel...
    </div>
  );
}

function App() {
  // Run migration once on app load
  useEffect(() => {
    const migrationKey = 'abf-products-migrated';
    if (!localStorage.getItem(migrationKey)) {
      console.log('Running product migration...');
      try {
        const count = migrateAllProducts();
        localStorage.setItem(migrationKey, 'true');
        console.log(`Successfully migrated ${count} products`);
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }
  }, []);

  return (
    <WishlistProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductPage />} />
          </Route>

          {/* Admin Panel — lazy loaded */}
          <Route path="/admin" element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={null}><Dashboard /></Suspense>
            } />
            <Route path="products" element={
              <Suspense fallback={null}><ProductsPage /></Suspense>
            } />
            <Route path="categories" element={
              <Suspense fallback={null}><CategoriesPage /></Suspense>
            } />
            <Route path="banners" element={
              <Suspense fallback={null}><BannersPage /></Suspense>
            } />
            <Route path="blog" element={
              <Suspense fallback={null}><BlogPage /></Suspense>
            } />
            <Route path="inquiries" element={
              <Suspense fallback={null}><InquiriesPage /></Suspense>
            } />
            <Route path="analytics" element={
              <Suspense fallback={null}><AnalyticsPage /></Suspense>
            } />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <h1 className="heading-2" style={{ color: 'var(--walnut)' }}>404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;
