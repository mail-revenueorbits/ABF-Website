import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * WYSIWYG rich text editor wrapper around React Quill.
 * Props: value, onChange, placeholder
 */
function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [2, 3, 4, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote'],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list',
    'blockquote',
    'link', 'image',
  ];

  return (
    <div className="admin-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}

export default RichTextEditor;
