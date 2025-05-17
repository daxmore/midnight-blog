export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        // Optional: Show a toast or snackbar notification
        console.log('Link copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

export const shareSocial = (platform, url, title) => {
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    };

    window.open(shareLinks[platform], '_blank');
};
