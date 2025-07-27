import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import SuccessPopup from '../components/common/SuccessPopup';
import { useBlog } from '../context/BlogContext';

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
    FaExclamationTriangle,
    FaListUl,
    FaListOl,
    FaQuoteRight,
    FaMinus,
    FaUndo,
    FaRedo,
    FaExclamationCircle
} from 'react-icons/fa';

// Constants
const MAX_CONTENT_LENGTH = 5000; // Strict 5000 characters limit
const WARNING_THRESHOLD = 0.8; // Show warning at 80% of limit
const STORAGE_WARNING_THRESHOLD = 0.7; // Show storage warning at 70% of total storage

const CreateBlogPost = () => {
    const { addBlog } = useBlog();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageWarning, setImageWarning] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [isNearLimit, setIsNearLimit] = useState(false);
    const fileInputRef = useRef(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    //custom hook to add the data to the blogpost
    const { storageInfo } = useContext(BlogContext);

    // Check storage usage
    useEffect(() => {
        if (storageInfo?.usageData?.percentUsed > STORAGE_WARNING_THRESHOLD) {
            alert('Storage space is running low. Consider deleting some old posts or keeping your content concise.');
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
            // Get plain text for character count
            const plainText = editor.getText();
            const count = plainText.length;
            setCharCount(count);
            setIsNearLimit(count > MAX_CONTENT_LENGTH * WARNING_THRESHOLD);
            
            // Store the HTML content for submission
            const htmlContent = editor.getHTML();
            setContent(htmlContent);
            
            // Prevent typing if limit is reached
            if (count >= MAX_CONTENT_LENGTH) {
                // Get the current content and truncate it
                const truncatedContent = plainText.slice(0, MAX_CONTENT_LENGTH);
                editor.commands.setContent(truncatedContent);
                // Move cursor to end of content
                editor.commands.focus('end');
            }
        },
        editorProps: {
            handleKeyDown: (view, event) => {
                const content = view.state.doc.textContent;
                // Prevent typing if at limit
                if (content.length >= MAX_CONTENT_LENGTH && 
                    !event.metaKey && // Allow cmd/ctrl + key combinations
                    !event.ctrlKey && 
                    !event.altKey && 
                    event.key.length === 1) { // Only block single character inputs
                    event.preventDefault();
                    return true;
                }
                return false;
            }
        }
    });

    const validateImage = async (imageData) => {
        if (!imageData) return { isValid: true }; // No image is valid

        // If it's a URL
        if (typeof imageData === 'string') {
            try {
                const response = await fetch(imageData);
                const contentType = response.headers.get('content-type');
                const contentLength = response.headers.get('content-length');

                if (!contentType?.startsWith('image/')) {
                    return {
                        isValid: false,
                        message: 'Invalid image URL. Please provide a valid image URL.'
                    };
                }

                if (contentLength && parseInt(contentLength) > 1024 * 1024) {
                    return {
                        isValid: false,
                        message: `Image size (${formatBytes(parseInt(contentLength))}) exceeds maximum limit of 1MB. Please use a smaller image.`
                    };
                }

                return { isValid: true };
            } catch (error) {
                return {
                    isValid: false,
                    message: 'Failed to validate image URL. Please check the URL and try again.'
                };
            }
        }

        // If it's a file
        if (imageData instanceof File) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(imageData.type)) {
                return {
                    isValid: false,
                    message: 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.'
                };
            }

            if (imageData.size > 1024 * 1024) {
                return {
                    isValid: false,
                    message: `Image size (${formatBytes(imageData.size)}) exceeds maximum limit of 1MB. Please use a smaller image.`
                };
            }

            return { isValid: true };
        }

        return { isValid: true };
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const validation = await validateImage(file);
            if (!validation.isValid) {
                setImageWarning({
                    type: 'error',
                    message: validation.message
                });
                setImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            
            if (file.size > 500 * 1024) {
                setImageWarning({
                    type: 'warning',
                    message: `Large image detected (${formatBytes(file.size)}). Consider using a smaller image or providing an image URL for better performance.`
                });
            } else {
                setImageWarning(null);
            }
            
            setImage(file);
            setImageUrl('');
        }
    };

    const handleImageUrlChange = async (e) => {
        const url = e.target.value;
        setImageUrl(url);
        
        if (url) {
            const validation = await validateImage(url);
            if (!validation.isValid) {
                setImageWarning({
                    type: 'error',
                    message: validation.message
                });
                setImageUrl('');
                return;
            }
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setImageWarning(null);
        }
    };

    const handleAddBlog = async () => {
        if (!title || !content || !category) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate image before posting
        const imageToValidate = imageUrl || image;
        if (imageToValidate) {
            const validation = await validateImage(imageToValidate);
            if (!validation.isValid) {
                setImageWarning({
                    type: 'error',
                    message: validation.message
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {
            let imageData = null;
            
            // Handle image data
            if (imageUrl) {
                // If it's a URL, use it directly
                imageData = imageUrl;
            } else if (image) {
                // If it's a file, convert it to base64
                imageData = await readFileAsDataURL(image);
            }

            const blogData = {
                title,
                content: editor.getHTML(),
                category,
                image: imageData,
                excerpt: editor.getText().replace(/<[^>]*>/g, '').slice(0, 150) + '...'
            };

            await addBlog(blogData);
            setTitle('');
            setContent('');
            setCategory('');
            setImage(null);
            setImageUrl('');
            setImageWarning(null);
            setCharCount(0);
            setIsNearLimit(false);
            editor.commands.setContent('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error adding blog:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to read file as data URL
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Helper function to format bytes
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

    return (
        <div className="container max-w-screen-lg mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
            
            <div className="space-y-6">
                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                {/* Category Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className='text-black'> {cat} </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">
                        Featured Image
                    </label>
                    
                    {/* File Upload */}
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-50 file:text-gray-700
                                hover:file:bg-gray-100"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Maximum file size: 1MB. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                    </div>

                    {/* Image URL Input */}
                    <div>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Or enter an image URL"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Provide a direct image URL if you have a large image
                        </p>
                    </div>

                    {/* Image Warning */}
                    {imageWarning && (
                        <div className={`p-4 rounded-lg ${
                            imageWarning.type === 'error' 
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                            <div className="flex items-start">
                                {imageWarning.type === 'error' ? (
                                    <FaExclamationCircle className="mt-1 mr-2 flex-shrink-0" />
                                ) : (
                                    <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
                                )}
                                <p className="text-sm font-medium">
                                    {imageWarning.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content *
                    </label>
                    <div className={`relative ${isNearLimit ? 'border-2 border-yellow-500' : 'border-2 border-gray-300'} rounded-lg`}>
                        {/* Editor Toolbar */}
                        {editor && (
                            <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50 text-gray-900 rounded-t-lg">
                                <button
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                                    title="Bold"
                                >
                                    <FaBold />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                                    title="Italic"
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                                    title="Heading 1"
                                >
                                    <FaHeading />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                                    title="Bullet List"
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                                    title="Numbered List"
                                >
                                    <FaListOl />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                                    title="Blockquote"
                                >
                                    <FaQuoteRight />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                    className="p-2 rounded hover:bg-gray-200"
                                    title="Horizontal Rule"
                                >
                                    <FaMinus />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().undo().run()}
                                    className="p-2 rounded hover:bg-gray-200"
                                    title="Undo"
                                >
                                    <FaUndo />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().redo().run()}
                                    className="p-2 rounded hover:bg-gray-200"
                                    title="Redo"
                                >
                                    <FaRedo />
                                </button>
                            </div>
                        )}
                        <EditorContent
                            editor={editor}
                            className="p-2 min-h-[200px]"
                        />
                        <div className={`absolute -bottom-7 right-2 text-sm ${isNearLimit ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {isNearLimit && <FaExclamationTriangle className="inline mr-1" />}
                            {charCount} / {MAX_CONTENT_LENGTH} characters
                            <span className="ml-2 text-xs">
                                (≈ {Math.round(charCount * 2 / 1024)}KB)
                            </span>
                        </div>
                    </div>
                    {isNearLimit && (
                        <div className="mt-8 text-sm text-yellow-500">
                            <FaExclamationTriangle className="inline mr-1" />
                            You're approaching the character limit. Consider splitting your content into multiple posts if needed.
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        onClick={handleAddBlog}
                        disabled={isSubmitting || charCount > MAX_CONTENT_LENGTH}
                        className={`px-6 py-2 rounded-lg text-white font-medium
                            ${(isSubmitting || charCount > MAX_CONTENT_LENGTH)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
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