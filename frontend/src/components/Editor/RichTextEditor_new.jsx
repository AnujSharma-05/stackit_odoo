import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Write your content...",
  minHeight = "150px" 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-white bg-transparent',
        style: `min-height: ${minHeight}; color: #ffffff !important;`,
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-600/50 rounded-lg bg-gray-800/30 backdrop-blur-sm overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-600/50 bg-gray-900/50 p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('bold') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Bold"
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('italic') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Italic"
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('strike') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Strikethrough"
          >
            <StrikethroughIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-600/50 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded text-sm font-medium hover:bg-gray-700/50 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded text-sm font-medium hover:bg-gray-700/50 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded text-sm font-medium hover:bg-gray-700/50 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Heading 3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-600/50 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('orderedList') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Numbered List"
          >
            <NumberedListIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-600/50 mx-1" />

          {/* Code and Link */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('code') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Inline Code"
          >
            <CodeBracketIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-700/50 transition-colors ${
              editor.isActive('link') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-600/50 mx-1" />

          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-2 rounded text-sm font-medium hover:bg-gray-700/50 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
            title="Code Block"
          >
            {'</>'}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[150px] relative">
        <EditorContent 
          editor={editor} 
          className="rich-text-editor-content"
        />
        {!content && (
          <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .rich-text-editor-content .ProseMirror {
          outline: none;
          color: #ffffff !important;
          background: transparent;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .rich-text-editor-content .ProseMirror p {
          color: #ffffff !important;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor-content .ProseMirror h1,
        .rich-text-editor-content .ProseMirror h2,
        .rich-text-editor-content .ProseMirror h3,
        .rich-text-editor-content .ProseMirror h4,
        .rich-text-editor-content .ProseMirror h5,
        .rich-text-editor-content .ProseMirror h6 {
          color: #ffffff !important;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .rich-text-editor-content .ProseMirror h1 { font-size: 1.5rem; }
        .rich-text-editor-content .ProseMirror h2 { font-size: 1.3rem; }
        .rich-text-editor-content .ProseMirror h3 { font-size: 1.1rem; }
        
        .rich-text-editor-content .ProseMirror ul,
        .rich-text-editor-content .ProseMirror ol {
          color: #ffffff !important;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor-content .ProseMirror li {
          color: #ffffff !important;
          margin: 0.25rem 0;
        }
        
        .rich-text-editor-content .ProseMirror code {
          background-color: rgba(55, 65, 81, 0.8) !important;
          color: #fbbf24 !important;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        
        .rich-text-editor-content .ProseMirror pre {
          background-color: rgba(17, 24, 39, 0.8) !important;
          color: #ffffff !important;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(75, 85, 99, 0.5);
          margin: 0.5rem 0;
          overflow-x: auto;
        }
        
        .rich-text-editor-content .ProseMirror pre code {
          background: none !important;
          color: #ffffff !important;
          padding: 0;
        }
        
        .rich-text-editor-content .ProseMirror blockquote {
          border-left: 4px solid rgba(59, 130, 246, 0.5);
          background-color: rgba(31, 41, 55, 0.3);
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          color: #ffffff !important;
        }
        
        .rich-text-editor-content .ProseMirror a {
          color: #60a5fa !important;
          text-decoration: underline;
        }
        
        .rich-text-editor-content .ProseMirror a:hover {
          color: #93c5fd !important;
        }
        
        .rich-text-editor-content .ProseMirror strong {
          color: #ffffff !important;
          font-weight: 600;
        }
        
        .rich-text-editor-content .ProseMirror em {
          color: #ffffff !important;
        }
        
        .rich-text-editor-content .ProseMirror::placeholder {
          color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
