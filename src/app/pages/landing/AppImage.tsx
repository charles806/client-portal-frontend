'use client';

import React, { useState } from 'react';


interface AppImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc = '/assets/images/no_image.png',
    ...props
}: AppImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // More reliable external URL detection
    const isExternal = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
    const isLocal = imageSrc.startsWith('/') || imageSrc.startsWith('./') || imageSrc.startsWith('data:');

    const handleError = () => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    // Scrub Next.js specific props before passing to img tag
    const {
        priority: _priority,
        quality: _quality,
        placeholder: _placeholder,
        blurDataURL: _blurDataURL,
        fill: _fill,
        sizes: _sizes,
        unoptimized: _unoptimized,
        ...restProps
    } = props;

    const commonClassName = `${className} ${isLoading ? 'bg-gray-200' : ''} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`;

    // For external URLs or when in doubt, use regular img tag
    if (isExternal && !isLocal) {
        const imgStyle: React.CSSProperties = {};

        if (width) imgStyle.width = width;
        if (height) imgStyle.height = height;

        if (fill) {
            return (
                <div className={`relative ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
                    <img
                        src={imageSrc}
                        alt={alt}
                        className={`${commonClassName} absolute inset-0 w-full h-full object-cover`}
                        onError={handleError}
                        onLoad={handleLoad}
                        onClick={onClick}
                        style={imgStyle}
                        {...restProps}
                    />
                </div>
            );
        }

        return (
            <img
                src={imageSrc}
                alt={alt}
                className={commonClassName}
                onError={handleError}
                onLoad={handleLoad}
                onClick={onClick}
                style={imgStyle}
                {...restProps}
            />
        );
    }

    // For local images and data URLs
    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <img
                    src={imageSrc}
                    alt={alt}
                    className={commonClassName}
                    onError={handleError}
                    onLoad={handleLoad}
                    onClick={onClick}
                    {...restProps}
                    style={{ objectFit: 'cover', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={commonClassName}
            onError={handleError}
            onLoad={handleLoad}
            onClick={onClick}
            {...restProps}
            width={width || 400}
            height={height || 300}
        />
    );
}

export default AppImage;