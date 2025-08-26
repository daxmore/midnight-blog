import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useContext } from 'react';
import { BlogContext } from '../../context/BlogContext';
import SuccessPopup from '../../components/ui/SuccessPopup';
import { useBlog } from '../../context/BlogContext';
import { useParams } from 'react-router-dom'; // Import useParams

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
import axios from 'axios';

// Constants
const MAX_CONTENT_LENGTH = 5000; // Strict 5000 characters limit
const WARNING_THRESHOLD = 0.8; // Show warning at 80% of limit
const STORAGE_WARNING_THRESHOLD = 0.7; // Show storage warning at 70% of total storage

const CreateBlogPost = () => {
    const { id } = useParams(); // Get ID from URL
    const { addBlog, getBlogByIdFromContext, updateBlog, loading: blogsLoading } = useBlog(); // Added blogsLoading
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
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode

    // Tiptap Editor Configuration - MOVED HERE
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

    const handleCloseErrorPopup = () => {
        setErrorMessage('');
    };

    useEffect(() => {
        if (id && !blogsLoading) { // Only run if id exists and blogs are loaded
            setIsEditMode(true);
            const blogToEdit = getBlogByIdFromContext(id);
            if (blogToEdit) {
                setTitle(blogToEdit.title);
                setContent(blogToEdit.content);
                setCategory(blogToEdit.category);
                setImageUrl(blogToEdit.featuredImage || '');
                // Set editor content
                if (editor) {
                    editor.commands.setContent(blogToEdit.content);
                }
            } else {
                // Handle case where blog is not found (e.g., redirect to 404 or home)
                console.error('Blog not found for editing:', id);
                // Optionally navigate away or show an error
            }
        } else if (!id) { // Only clear form if not in edit mode
            setIsEditMode(false);
            // Clear form if not in edit mode
            setTitle('');
            setContent('');
            setCategory('');
            setImage(null);
            setImageUrl('');
            if (editor) {
                editor.commands.setContent('');
            }
        }
    }, [id, editor, getBlogByIdFromContext, blogsLoading]);

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
                excerpt: editor.getText().replace(/<[^>]*>/g, '').slice(0, 150) + '...',
                author: 'Dax More' // Replace with actual author data
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
            setErrorMessage(error.response?.data?.message || 'An error occurred while adding the blog post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBlog = async () => {
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
                excerpt: editor.getText().replace(/<[^>]*>/g, '').slice(0, 150) + '...',
                author: 'Dax More' // Replace with actual author data
            };

            await updateBlog(id, blogData); // Use updateBlog from context
            setShowSuccessPopup(true);
        } catch (error) {
            console.error('Error updating blog:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred while updating the blog post.');
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
        <div class="container max-w-screen-lg mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">Create New Blog Post</h1>
            
            <div class="space-y-6">
                {/* Title Input */}
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                {/* Category Input */}
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat} class='text-black'> {cat} </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload Section */}
                <div class="space-y-4">
                    <label class="block text-sm font-medium text-gray-300">
                        Featured Image
                    </label>
                    
                    {/* File Upload */}
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            class="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-50 file:text-gray-700
                                hover:file:bg-gray-100"
                        />
                        <p class="mt-1 text-sm text-gray-500">
                            Maximum file size: 1MB. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                    </div>

                    {/* Image URL Input */}
                    <div>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Or enter an image URL"
                        />
                        <p class="mt-1 text-sm text-gray-500">
                            Provide a direct image URL if you have a large image
                        </p>
                    </div>

                    {/* Image Warning */}
                    {imageWarning && (
                        <div class={`p-4 rounded-lg ${
                            imageWarning.type === 'error' 
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                            <div class="flex items-start">
                                {imageWarning.type === 'error' ? (
                                    <FaExclamationCircle class="mt-1 mr-2 flex-shrink-0" />
                                ) : (
                                    <FaExclamationTriangle class="mt-1 mr-2 flex-shrink-0" />
                                )}
                                <p class="text-sm font-medium">
                                    {imageWarning.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Content *
                    </label>
                    <div class={`relative ${isNearLimit ? 'border-2 border-yellow-500' : 'border-2 border-gray-300'} rounded-lg`}>
                        {/* Editor Toolbar */}
                        {editor && (
                            <div class="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50 text-gray-900 rounded-t-lg">
                                <button
                                    onClick={() => editor.chain().focus().toggleBold().run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                                    title="Bold"
                                >
                                    <FaBold />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleItalic().run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                                    title="Italic"
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                                    title="Heading 1"
                                >
                                    <FaHeading />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                                    title="Bullet List"
                                >
                                    <FaListUl />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                                    title="Numbered List"
                                >
                                    <FaListOl />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                    class={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                                    title="Blockquote"
                                >
                                    <FaQuoteRight />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                    class="p-2 rounded hover:bg-gray-200"
                                    title="Horizontal Rule"
                                >
                                    <FaMinus />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().undo().run()}
                                    class="p-2 rounded hover:bg-gray-200"
                                    title="Undo"
                                >
                                    <FaUndo />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().redo().run()}
                                    class="p-2 rounded hover:bg-gray-200"
                                    title="Redo"
                                >
                                    <FaRedo />
                                </button>
                            </div>
                        )}
                        <EditorContent
                            editor={editor}
                            class="p-2 min-h-[200px]"
                        />
                        <div class={`absolute -bottom-7 right-2 text-sm ${isNearLimit ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {isNearLimit && <FaExclamationTriangle class="inline mr-1" />}
                            {charCount} / {MAX_CONTENT_LENGTH} characters
                            <span class="ml-2 text-xs">
                                (≈ {Math.round(charCount * 2 / 1024)}KB)
                            </span>
                        </div>
                    </div>
                    {isNearLimit && (
                        <div class="mt-8 text-sm text-yellow-500">
                            <FaExclamationTriangle class="inline mr-1" />
                            You're approaching the character limit. Consider splitting your content into multiple posts if needed.
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        onClick={isEditMode ? handleUpdateBlog : handleAddBlog} // Conditional onClick
                        disabled={isSubmitting || charCount > MAX_CONTENT_LENGTH}
                        class={`px-6 py-2 rounded-lg text-white font-medium
                            ${(isSubmitting || charCount > MAX_CONTENT_LENGTH)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Post' : 'Publish Post')}
                    </button>
                </div>
            </div>

            {/* Success Popup */}
            <SuccessPopup
                isVisible={showSuccessPopup}
                message={`Your blog post has been ${isEditMode ? 'updated' : 'published'} successfully!`}
                onClose={() => setShowSuccessPopup(false)}
                autoCloseTime={4000}
            />

            {errorMessage && (
                <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm w-full mx-4">
                        <h3 class="text-lg font-bold mb-4 text-red-400">Error</h3>
                        <p class="mb-6">{errorMessage}</p>
                        <button
                            onClick={handleCloseErrorPopup}
                            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBlogPost;