import React, { useState, useEffect } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import ImageUploader from '../../components/admin/ImageUploader';
import RichTextEditor from '../../components/admin/RichTextEditor';
import useProductStore from '../../store/productStore';
import useCategoryStore from '../../store/categoryStore';
import { showToast } from '../../components/admin/AdminToast';

const EMPTY_PRODUCT = {
  name: '',
  slug: '',
  description: '',
  categoryId: '',
  price: '',
  salePrice: '',
  onSale: false,
  images: [],
  material: '',
  dimensions: { height: '', width: '', depth: '' },
  weight: '',
  colorOptions: '',
  seatingCapacity: '',
  warranty: '',
  careInstructions: '',
  assemblyRequired: false,
  deliveryInfo: 'Free delivery inside Kathmandu Valley',
  stockStatus: 'in_stock',
  sku: '',
  tags: [],
  featured: false,
  published: false,
};

function ProductFormModal({ isOpen, onClose, product }) {
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const categories = useCategoryStore((s) => s.categories);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [tagsInput, setTagsInput] = useState('');

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        ...EMPTY_PRODUCT,
        ...product,
        price: product.price?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
      });
      setTagsInput(product.tags?.join(', ') || '');
    } else {
      setForm(EMPTY_PRODUCT);
      setTagsInput('');
    }
    setErrors({});
  }, [product, isOpen]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateDimension = (key, value) => {
    setForm((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value },
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.categoryId) errs.categoryId = 'Category is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errs.price = 'Valid price is required';
    }
    if (form.onSale && (!form.salePrice || isNaN(Number(form.salePrice)) || Number(form.salePrice) <= 0)) {
      errs.salePrice = 'Valid sale price is required';
    }
    if (form.onSale && Number(form.salePrice) >= Number(form.price)) {
      errs.salePrice = 'Sale price must be less than regular price';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      ...form,
      slug: form.slug || generateSlug(form.name),
      price: Number(form.price),
      salePrice: form.onSale ? Number(form.salePrice) : null,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isEditing) {
      updateProduct(product.id, data);
      showToast('Product updated successfully');
    } else {
      addProduct(data);
      showToast('Product created successfully');
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit: ${product.name}` : 'Add New Product'}
      large
      footer={
        <>
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSubmit}>
            <span className="material-symbols-outlined">save</span>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </button>
        </>
      }
    >
      {/* Name & SKU */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label admin-form-required">Product Name</label>
          <input
            type="text"
            className={`admin-input ${errors.name ? 'admin-input-error' : ''}`}
            value={form.name}
            onChange={(e) => {
              updateField('name', e.target.value);
              if (!isEditing) updateField('slug', generateSlug(e.target.value));
            }}
            placeholder="e.g. Royal Sofa Set"
          />
          {errors.name && <p className="admin-form-error">{errors.name}</p>}
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">SKU / Product Code</label>
          <input
            type="text"
            className="admin-input"
            value={form.sku}
            onChange={(e) => updateField('sku', e.target.value)}
            placeholder="e.g. ABF-SOF-001"
          />
        </div>
      </div>

      {/* Category & Material */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label admin-form-required">Category</label>
          <select
            className={`admin-select ${errors.categoryId ? 'admin-input-error' : ''}`}
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="admin-form-error">{errors.categoryId}</p>}
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Material(s)</label>
          <input
            type="text"
            className="admin-input"
            value={form.material}
            onChange={(e) => updateField('material', e.target.value)}
            placeholder="e.g. Sheesham Wood, Italian Marble"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label admin-form-required">Price (NPR)</label>
          <input
            type="number"
            className={`admin-input ${errors.price ? 'admin-input-error' : ''}`}
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="e.g. 474999"
            min="0"
          />
          {errors.price && <p className="admin-form-error">{errors.price}</p>}
        </div>
        <div className="admin-form-group">
          <div className="admin-checkbox-wrapper" style={{ marginBottom: '8px' }}>
            <input
              type="checkbox"
              className="admin-checkbox"
              id="onSale"
              checked={form.onSale}
              onChange={(e) => updateField('onSale', e.target.checked)}
            />
            <label htmlFor="onSale" className="admin-form-label" style={{ cursor: 'pointer' }}>
              On Sale
            </label>
          </div>
          {form.onSale && (
            <>
              <input
                type="number"
                className={`admin-input ${errors.salePrice ? 'admin-input-error' : ''}`}
                value={form.salePrice}
                onChange={(e) => updateField('salePrice', e.target.value)}
                placeholder="Sale price in NPR"
                min="0"
              />
              {errors.salePrice && <p className="admin-form-error">{errors.salePrice}</p>}
            </>
          )}
        </div>
      </div>

      {/* Description (WYSIWYG) */}
      <div className="admin-form-group">
        <label className="admin-form-label">Description</label>
        <RichTextEditor
          value={form.description}
          onChange={(val) => updateField('description', val)}
          placeholder="Write product description..."
        />
      </div>

      {/* Images */}
      <div className="admin-form-group">
        <label className="admin-form-label">Product Images</label>
        <ImageUploader
          images={form.images}
          onChange={(imgs) => updateField('images', imgs)}
          maxImages={8}
        />
      </div>

      {/* Dimensions */}
      <div className="admin-form-group">
        <label className="admin-form-label">Dimensions</label>
        <div className="admin-form-grid-3">
          <input
            type="text"
            className="admin-input"
            value={form.dimensions.height}
            onChange={(e) => updateDimension('height', e.target.value)}
            placeholder='Height (e.g. 36")'
          />
          <input
            type="text"
            className="admin-input"
            value={form.dimensions.width}
            onChange={(e) => updateDimension('width', e.target.value)}
            placeholder='Width (e.g. 120")'
          />
          <input
            type="text"
            className="admin-input"
            value={form.dimensions.depth}
            onChange={(e) => updateDimension('depth', e.target.value)}
            placeholder='Depth (e.g. 40")'
          />
        </div>
      </div>

      {/* Weight, Color, Seating */}
      <div className="admin-form-grid-3">
        <div className="admin-form-group">
          <label className="admin-form-label">Weight</label>
          <input
            type="text"
            className="admin-input"
            value={form.weight}
            onChange={(e) => updateField('weight', e.target.value)}
            placeholder="e.g. 85 kg"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Color Options</label>
          <input
            type="text"
            className="admin-input"
            value={form.colorOptions}
            onChange={(e) => updateField('colorOptions', e.target.value)}
            placeholder="e.g. Blue, Ivory, Brown"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Seating Capacity</label>
          <input
            type="text"
            className="admin-input"
            value={form.seatingCapacity}
            onChange={(e) => updateField('seatingCapacity', e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
      </div>

      {/* Warranty & Care */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">Warranty</label>
          <input
            type="text"
            className="admin-input"
            value={form.warranty}
            onChange={(e) => updateField('warranty', e.target.value)}
            placeholder="e.g. 5 Years"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Care Instructions</label>
          <input
            type="text"
            className="admin-input"
            value={form.careInstructions}
            onChange={(e) => updateField('careInstructions', e.target.value)}
            placeholder="e.g. Vacuum regularly"
          />
        </div>
      </div>

      {/* Stock & Delivery */}
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">Stock Status</label>
          <select
            className="admin-select"
            value={form.stockStatus}
            onChange={(e) => updateField('stockStatus', e.target.value)}
          >
            <option value="in_stock">In Stock</option>
            <option value="made_to_order">Made to Order</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Delivery Info</label>
          <input
            type="text"
            className="admin-input"
            value={form.deliveryInfo}
            onChange={(e) => updateField('deliveryInfo', e.target.value)}
            placeholder="e.g. Free delivery inside Kathmandu Valley"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="admin-form-group">
        <label className="admin-form-label">Tags (comma-separated)</label>
        <input
          type="text"
          className="admin-input"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. premium, teak, bestseller"
        />
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: '32px', paddingTop: '8px' }}>
        <div className="admin-checkbox-wrapper">
          <input
            type="checkbox"
            className="admin-checkbox"
            id="assemblyRequired"
            checked={form.assemblyRequired}
            onChange={(e) => updateField('assemblyRequired', e.target.checked)}
          />
          <label htmlFor="assemblyRequired" className="admin-form-label" style={{ cursor: 'pointer' }}>
            Assembly Required
          </label>
        </div>
        <div className="admin-checkbox-wrapper">
          <input
            type="checkbox"
            className="admin-checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => updateField('featured', e.target.checked)}
          />
          <label htmlFor="featured" className="admin-form-label" style={{ cursor: 'pointer' }}>
            Featured Product
          </label>
        </div>
        <div className="admin-checkbox-wrapper">
          <input
            type="checkbox"
            className="admin-checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => updateField('published', e.target.checked)}
          />
          <label htmlFor="published" className="admin-form-label" style={{ cursor: 'pointer' }}>
            Published (Visible on website)
          </label>
        </div>
      </div>
    </AdminModal>
  );
}

export default ProductFormModal;
