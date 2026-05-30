import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../api/users';

export default function TiptapEditor({ content, onChange }) {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-secondary underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-md max-w-full my-4' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Start writing your story...' }),
    ],
    content: content || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-content min-h-[300px] px-4 py-3 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const insertImageFromUrl = () => {
    const url = window.prompt('Image URL');
    if (url?.trim()) {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editor) return;

    try {
      const { data } = await uploadImage(file);
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success('Image inserted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed — try "Image URL" or configure Cloudinary');
    }
  };

  const setLink = () => {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded-sm transition-colors ${
        active ? 'bg-primary text-primary-text' : 'text-neutral-body hover:bg-primary/5'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-neutral-body/15 rounded-sm overflow-hidden bg-surface">
      <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-body/10 bg-background/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered list"
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          Quote
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code block"
        >
          {'</>'}
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link">
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Upload image"
        >
          Image
        </ToolbarButton>
        <ToolbarButton onClick={insertImageFromUrl} title="Insert image from URL">
          Image URL
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert table"
        >
          Table
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          —
        </ToolbarButton>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {editor.isActive('table') && (
        <div className="flex flex-wrap gap-1 px-2 py-1.5 border-b border-neutral-body/10 bg-background/30 text-xs">
          <button type="button" className="px-2 py-0.5 hover:bg-primary/5 rounded-sm" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col</button>
          <button type="button" className="px-2 py-0.5 hover:bg-primary/5 rounded-sm" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</button>
          <button type="button" className="px-2 py-0.5 hover:bg-primary/5 rounded-sm" onClick={() => editor.chain().focus().deleteColumn().run()}>− Col</button>
          <button type="button" className="px-2 py-0.5 hover:bg-primary/5 rounded-sm" onClick={() => editor.chain().focus().deleteRow().run()}>− Row</button>
          <button type="button" className="px-2 py-0.5 hover:bg-red-50 text-red-600 rounded-sm" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
