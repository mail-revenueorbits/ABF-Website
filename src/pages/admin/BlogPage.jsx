import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useBlogStore from '../../store/blogStore';
import AdminModal from '../../components/admin/AdminModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/AdminToast';

const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'AB Furniture Team',
  tags: [],
  published: false,
};

function BlogPage() {
  const posts = useBlogStore((s) => s.posts);
  const addPost = useBlogStore((s) => s.addPost);
  const updatePost = useBlogStore((s) => s.updatePost);
  const deletePost = useBlogStore((s) => s.deletePost);
  const togglePublish = useBlogStore((s) => s.togglePublish);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(searchParams.get('action') === 'new');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_POST);
  const [tagsInput, setTagsInput] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({ ...EMPTY_POST, ...editing });
      setTagsInput(editing.tags?.join(', ') || '');
    } else {
      setForm(EMPTY_POST);
      setTagsInput('');
    }
    setErrors({});
  }, [editing, isFormOpen]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.content || form.content === '<p><br></p>') errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const data = {
      ...form,
      slug: form.slug || generateSlug(form.title),
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editing) {
      updatePost(editing.id, data);
      showToast('Blog post updated');
    } else {
      addPost(data);
      showToast('Blog post created');
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditing(null);
    if (searchParams.get('action')) setSearchParams({});
  };

  const handleImageChange = (images) => {
    updateField('coverImage', images[0] || '');
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog</h1>
          <p className="admin-page-subtitle">{posts.length} post(s) — {posts.filter(p => p.published).length} published</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditing(null); setIsFormOpen(true); }}>
          <span className="material-symbols-outlined">edit_note</span>
          New Post
        </button>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <span className="material-symbols-outlined">article</span>
            <h3>No blog posts yet</h3>
            <p>Create your first post to share furniture tips and stories.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((post) => (
              <div key={post.id} className="admin-card" style={{ display: 'flex', overflow: 'hidden' }}>
                {/* Cover thumbnail */}
                {post.coverImage && (
                  <div style={{ width: '200px', minHeight: '140px', flexShrink: 0, background: '#F5F2ED' }}>
                    <img
                      src={post.coverImage}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className={`admin-badge ${post.published ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.tags?.map((tag) => (
                        <span key={tag} className="admin-badge admin-badge-info">{tag}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--walnut-dark)', marginBottom: '4px' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {post.excerpt || 'No excerpt provided.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>By {post.author}</span>
                      <span>|</span>
                      <span>{new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => togglePublish(post.id)}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => { setEditing(post); setIsFormOpen(true); }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setDeleteId(post.id)}
                        style={{ color: '#C53030' }}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Blog Form Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editing ? `Edit: ${editing.title}` : 'New Blog Post'}
        large
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={handleFormClose}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave}>
              <span className="material-symbols-outlined">save</span>
              {editing ? 'Save Changes' : 'Create Post'}
            </button>
          </>
        }
      >
        <div className="admin-form-group">
          <label className="admin-form-label admin-form-required">Title</label>
          <input
            type="text"
            className={`admin-input ${errors.title ? 'admin-input-error' : ''}`}
            value={form.title}
            onChange={(e) => {
              updateField('title', e.target.value);
              if (!editing) updateField('slug', generateSlug(e.target.value));
            }}
            placeholder="e.g. How to Choose the Perfect Sofa"
          />
          {errors.title && <p className="admin-form-error">{errors.title}</p>}
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">URL Slug</label>
            <input
              type="text"
              className="admin-input"
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="auto-generated"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Author</label>
            <input
              type="text"
              className="admin-input"
              value={form.author}
              onChange={(e) => updateField('author', e.target.value)}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Excerpt</label>
          <textarea
            className="admin-textarea"
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="Brief summary for listing pages (1-2 sentences)"
            rows={3}
            style={{ minHeight: '80px' }}
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Cover Image</label>
          <ImageUploader
            images={form.coverImage ? [form.coverImage] : []}
            onChange={handleImageChange}
            maxImages={1}
          />
        </div>

        <div className="admin-form-group">
          <label className={`admin-form-label ${errors.content ? 'admin-form-required' : ''}`}>Content</label>
          <RichTextEditor
            value={form.content}
            onChange={(val) => updateField('content', val)}
            placeholder="Write your blog post..."
          />
          {errors.content && <p className="admin-form-error">{errors.content}</p>}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="admin-input"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. sofas, guide, living room"
          />
        </div>

        <div className="admin-checkbox-wrapper">
          <input
            type="checkbox"
            className="admin-checkbox"
            id="blogPublished"
            checked={form.published}
            onChange={(e) => updateField('published', e.target.checked)}
          />
          <label htmlFor="blogPublished" className="admin-form-label" style={{ cursor: 'pointer' }}>
            Publish immediately
          </label>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deletePost(deleteId); showToast('Blog post deleted'); }}
        title="Delete Blog Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}

export default BlogPage;
