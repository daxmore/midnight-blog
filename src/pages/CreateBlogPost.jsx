import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import SuccessPopup from '../components/common/SuccessPopup';

// React Icons
import {
    FaPencilAlt,
    FaFolder,
    FaImage,
    FaFileAlt,
    FaPaperPlane,
    FaTimes,
    FaBold,
    FaItalic,
    FaHeading,
    FaExclamationTriangle
} from 'react-icons/fa';

// Constants
const MAX_CONTENT_LENGTH = 15000; // 15,000 characters limit (about 30KB)
const WARNING_THRESHOLD = 0.8; // Show warning at 80% of limit
const STORAGE_WARNING_THRESHOLD = 0.7; // Show storage warning at 70% of total storage

const CreateBlogPost = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const [isNearLimit, setIsNearLimit] = useState(false);
    const [storageWarning, setStorageWarning] = useState(false);
    const imageInputRef = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    //custom hook to add the data to the blogpost
    const { addBlog, storageInfo } = useContext(BlogContext);

    // Check storage usage
    useEffect(() => {
        if (storageInfo?.usageData?.percentUsed > STORAGE_WARNING_THRESHOLD) {
            setStorageWarning(true);
        } else {
            setStorageWarning(false);
        }
    }, [storageInfo]);

    // Tiptap Editor Configuration
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: 'Write your blog post content here...'
            })
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const content = editor.getText();
            const count = content.length;
            setCharCount(count);
            setIsNearLimit(count > MAX_CONTENT_LENGTH * WARNING_THRESHOLD);
            
            // Prevent typing if limit is reached
            if (count > MAX_CONTENT_LENGTH) {
                // Truncate content to max length
                const truncatedContent = content.slice(0, MAX_CONTENT_LENGTH);
                editor.commands.setContent(truncatedContent);
            }
        }
    });

    const handleAddBlog = (e) => {
        e.preventDefault();

        const content = editor ? editor.getHTML() : '';

        if (!title.trim() || !category || !content || content === '<p></p>' || !image) {
            alert('Please fill in all required fields.');
            return;
        }

        if (charCount > MAX_CONTENT_LENGTH) {
            alert(`Content exceeds the maximum length of ${MAX_CONTENT_LENGTH} characters.`);
            return;
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const blogData = {
            title,
            category,
            content,
            image,
            slug,
            status: 'published',
        };

        addBlog(blogData);

        setShowSuccessPopup(true);

        setTitle('');
        setCategory('');
        setImage(null);
        setCharCount(0);
        setIsNearLimit(false);
        editor?.commands.clearContent();
        editor?.view.focus();
    };

    // Category options
    const categories = [
        'Development',
        'Design',
        'Technology',
        'Artificial Intelligence',
        'Web Development',
        'Machine Learning'
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);

                // Add image to Tiptap editor if editor exists
                if (editor) {
                    editor.chain().focus().setImage({ src: reader.result }).run();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto">
                {/* Storage Warning */}
                {storageWarning && (
                    <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded text-yellow-300">
                        <FaExclamationTriangle className="inline mr-2" />
                        Storage space is running low. Consider deleting some old posts or keeping your content concise.
                    </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <FaPencilAlt className="mr-2 text-blue-500" />
                        Blog Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your blog post title"
                        className="w-full p-2 border rounded bg-transparent"
                    />
                </div>

                {/* Category Selector */}
                <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <FaFolder className="mr-2 text-green-500" />
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className='text-black'> {cat} </option>
                        ))}
                    </select>
                </div>

                {/* Tiptap Rich Text Editor */}
                <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <FaFileAlt className="mr-2 text-purple-500" />
                        Blog Content
                    </label>

                    {/* Toolbar */}
                    {editor && (
                        <div className="flex space-x-2 mb-2 p-2 border rounded">
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`p-1 ${editor.isActive('bold') ? 'bg-blue-200' : ''}`}
                            >
                                <FaBold />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`p-1 ${editor.isActive('italic') ? 'bg-blue-200' : ''}`}
                            >
                                <FaItalic />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={`p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-200' : ''}`}
                            >
                                <FaHeading />
                            </button>
                        </div>
                    )}

                    {/* Editor Content */}
                    <div className={`relative ${isNearLimit ? 'border-2 border-yellow-500' : 'border'}`}>
                        <EditorContent
                            editor={editor}
                            className="p-2 min-h-[200px]"
                        />
                        <div className={`absolute bottom-2 right-2 text-sm ${isNearLimit ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {isNearLimit && <FaExclamationTriangle className="inline mr-1" />}
                            {charCount} / {MAX_CONTENT_LENGTH} characters
                            <span className="ml-2 text-xs">
                                (≈ {Math.round(charCount * 2 / 1024)}KB)
                            </span>
                        </div>
                    </div>
                    {isNearLimit && (
                        <div className="mt-1 text-sm text-yellow-500">
                            You're approaching the character limit. Consider splitting your content into multiple posts if needed.
                        </div>
                    )}
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <FaImage className="mr-2 text-red-500" />
                        Feature Image
                    </label>
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => imageInputRef.current.click()}
                        className="flex items-center p-2 border rounded"
                    >
                        <FaImage className="mr-2" /> Upload Image
                    </button>
                    {image && (
                        <img
                            src={image}
                            alt="Feature"
                            className="mt-2 max-w-full h-auto"
                        />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => handleAddBlog(e)}
                        className="flex items-center p-2 bg-green-500 text-white rounded"
                    >
                        <FaPaperPlane className="mr-2" /> Publish
                    </button>
                    <button
                        onClick={() => { setTitle(''); setCategory(''); setImage(null); editor?.commands.clearContent(); editor?.view.focus(); }}
                        className="flex items-center p-2 bg-red-500 text-white rounded"
                    >
                        <FaTimes className="mr-2" /> Cancel
                    </button>
                </div>
            </div>

            {/* Success Popup */}
            <SuccessPopup
                isVisible={showSuccessPopup}
                message="Your blog post has been published successfully!"
                onClose={() => setShowSuccessPopup(false)}
                autoCloseTime={4000}
            />
        </div>
    );
};

export default CreateBlogPost;