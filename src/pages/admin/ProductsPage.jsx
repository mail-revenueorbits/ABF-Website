import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import useCategoryStore from '../../store/categoryStore';
import { formatNPR } from '../../utils/formatCurrency';
import ProductFormModal from './ProductFormModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/AdminToast';

function ProductsPage() {
  const products = useProductStore((s) => s.products);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const deleteProducts = useProductStore((s) => s.deleteProducts);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const categories = useCategoryStore((s) => s.categories);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(searchParams.get('action') === 'new');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product id or 'bulk'

  // Filtered & searched products
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    if (stockFilter !== 'all') {
      result = result.filter((p) => p.stockStatus === stockFilter);
    }

    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [products, search, categoryFilter, stockFilter]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Uncategorized';
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const handleBulkDelete = () => {
    deleteProducts(selectedIds);
    setSelectedIds([]);
    showToast(`${selectedIds.length} product(s) deleted`);
  };

  const handleBulkTogglePublish = (publish) => {
    selectedIds.forEach((id) => {
      updateProduct(id, { published: publish });
    });
    setSelectedIds([]);
    showToast(`${selectedIds.length} product(s) ${publish ? 'published' : 'unpublished'}`);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    // Clear URL param
    if (searchParams.get('action')) {
      setSearchParams({});
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">{products.length} total products in catalog</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            className="admin-input"
            placeholder="Search products, SKU, materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <select
          className="admin-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          className="admin-select"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="all">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="made_to_order">Made to Order</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          marginBottom: '16px',
          background: 'rgba(112, 74, 46, 0.04)',
          borderRadius: '8px',
          border: '1px solid rgba(112, 74, 46, 0.1)'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--walnut)' }}>
            {selectedIds.length} selected
          </span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleBulkTogglePublish(true)}>
            Publish
          </button>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => handleBulkTogglePublish(false)}>
            Unpublish
          </button>
          <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteConfirm('bulk')}>
            <span className="material-symbols-outlined">delete</span>
            Delete
          </button>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setSelectedIds([])}>
            Clear
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty">
                      <span className="material-symbols-outlined">inventory_2</span>
                      <h3>No products found</h3>
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="admin-checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="admin-table-img" />
                        ) : (
                          <div className="admin-table-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>image</span>
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '500', color: 'var(--walnut-dark)', fontSize: '13px' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px' }}>{getCategoryName(p.categoryId)}</span>
                    </td>
                    <td>
                      {p.onSale ? (
                        <div>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '11px' }}>{formatNPR(p.price)}</span>
                          <br />
                          <span style={{ color: '#C53030', fontWeight: '600', fontSize: '13px' }}>{formatNPR(p.salePrice)}</span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: '500', fontSize: '13px' }}>{formatNPR(p.price)}</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        p.stockStatus === 'in_stock' ? 'admin-badge-success' :
                        p.stockStatus === 'made_to_order' ? 'admin-badge-info' : 'admin-badge-danger'
                      }`}>
                        {p.stockStatus === 'in_stock' ? 'In Stock' : p.stockStatus === 'made_to_order' ? 'Made to Order' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${p.published ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                      {p.onSale && (
                        <span className="admin-badge admin-badge-warning" style={{ marginLeft: '4px' }}>Sale</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleEdit(p)} title="Edit">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteConfirm(p.id)} title="Delete" style={{ color: '#C53030' }}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        product={editingProduct}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm === 'bulk') {
            handleBulkDelete();
          } else {
            deleteProduct(deleteConfirm);
            showToast('Product deleted');
          }
        }}
        title="Delete Product"
        message={
          deleteConfirm === 'bulk'
            ? `Are you sure you want to delete ${selectedIds.length} selected product(s)? This action cannot be undone.`
            : 'Are you sure you want to delete this product? This action cannot be undone.'
        }
        confirmText="Delete"
      />
    </div>
  );
}

export default ProductsPage;
