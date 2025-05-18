import React, { createContext, useContext, useState } from 'react';
import { useBlog } from './BlogContext';

// Create the context
const DeleteCommentContext = createContext();

// Custom hook to use the context
export const useDeleteComment = () => {
  const context = useContext(DeleteCommentContext);
  if (!context) {
    throw new Error('useDeleteComment must be used within a DeleteCommentProvider');
  }
  return context;
};

export const DeleteCommentProvider = ({ children }) => {
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Get removeComment function from BlogContext
  let blogContext = { removeComment: () => {} };
  try {
    blogContext = useBlog();
  } catch (error) {
    console.warn('BlogContext not available, delete functionality will be limited');
  }
  
  const { removeComment } = blogContext;
  
  // Function to handle setting a comment for deletion
  const prepareDeleteComment = (blogId, commentId) => {
    setCommentToDelete({ blogId, commentId });
  };
  
  // Function to cancel deletion
  const cancelDeleteComment = () => {
    setCommentToDelete(null);
    setDeleteError('');
  };
  
  // Function to delete a comment
  const deleteComment = async () => {
    if (!commentToDelete) return;
    
    setIsDeletingComment(true);
    setDeleteError('');
    setDeleteSuccess(false);
    
    try {
      const { blogId, commentId } = commentToDelete;
      
      // Use the removeComment function from BlogContext
      removeComment(blogId, commentId);
      
      // Show success message
      setDeleteSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      
      // Reset commentToDelete
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setDeleteError('Failed to delete comment. Please try again.');
    } finally {
      setIsDeletingComment(false);
    }
  };
  
  // Context value to be provided
  const contextValue = {
    isDeletingComment,
    commentToDelete,
    deleteError,
    deleteSuccess,
    prepareDeleteComment,
    cancelDeleteComment,
    deleteComment
  };
  
  return (
    <DeleteCommentContext.Provider value={contextValue}>
      {children}
    </DeleteCommentContext.Provider>
  );
};

export default DeleteCommentContext; 