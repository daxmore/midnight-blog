import React from 'react';

const MetaTags = ({
    title,
    description,
    image,
    url
}) => {
    return (
        <>
            <title>{title} </title>
            < meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
        </>
    );
};

export default MetaTags;