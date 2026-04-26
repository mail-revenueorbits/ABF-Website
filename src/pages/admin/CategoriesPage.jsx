import React, { useState } from 'react';
import useCategoryStore from '../../store/categoryStore';
import useProductStore from '../../store/productStore';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/AdminToast';

function CategoriesPage() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const products = useProductStore((s) => s.products);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [error, setError] = useState('');

  const getProductCount = (catId) => products.filter((p) => p.categoryId === catId).length;

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openNew = () => {
    setEditing(null);
    setFormName('');
    setFormSlug('');
    setError('');
    setIsFormOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setError('');
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      setError('Category name is required');
      return;
    }
    const slug = formSlug.trim() || generateSlug(formName);
    const duplicate = categories.find(
      (c) => c.slug === slug && c.id !== editing?.id
    );
    if (duplicate) {
      setError('A category with this slug already exists');
      return;
    }

    if (editing) {
      updateCategory(editing.id, { name: formName.trim(), slug });
      showToast('Category updated');
    } else {
      addCategory({ name: formName.trim(), slug, parentId: null });
      showToast('Category created');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    const count = getProductCount(deleteId);
    if (count > 0) {
      showToast(`Cannot delete: ${count} product(s) use this category`, 'error');
      return;
    }
    deleteCategory(deleteId);
    showToast('Category deleted');
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">{categories.length} product categories</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openNew}>
          <span className="material-symbols-outlined">add</span>
          Add Category
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .sort((a, b) => a.order - b.order)
                .map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: '500', color: 'var(--text-muted)' }}>{cat.order}</td>
                    <td style={{ fontWeight: '500', color: 'var(--walnut-dark)' }}>{cat.name}</td>
                    <td>
                      <code style={{
                        fontSize: '12px',
                        background: 'rgba(112,74,46,0.06)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)'
                      }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td>{getProductCount(cat.id)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(cat)} title="Edit">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setDeleteId(cat.id)}
                          title="Delete"
                          style={{ color: '#C53030' }}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editing ? 'Edit Category' : 'New Category'}
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}>
              {editing ? 'Save Changes' : 'Create Category'}
            </button>
          </>
        }
      >
        <div className="admin-form-group">
          <label className="admin-form-label admin-form-required">Category Name</label>
          <input
            type="text"
            className={`admin-input ${error ? 'admin-input-error' : ''}`}
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (!editing) setFormSlug(generateSlug(e.target.value));
              setError('');
            }}
            placeholder="e.g. Sofas & Sofa Sets"
            autoFocus
          />
          {error && <p className="admin-form-error">{error}</p>}
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">URL Slug</label>
          <input
            type="text"
            className="admin-input"
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value)}
            placeholder="auto-generated from name"
          />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Used in URLs: /shop/{formSlug || 'category-slug'}
          </p>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products assigned to it will become uncategorized."
        confirmText="Delete"
      />
    </div>
  );
}

export default CategoriesPage;
