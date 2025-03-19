import React from 'react'

interface ResponsiveImageProps {
    src: string;
    alt: string;
    className?: string;
}

// Eventually, this component will include logic to fetch the correct size of a given image
// This logic has been isolated into a component since it would otherwise be replicated for wherever images are displayed
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  return (
    <img src={src} alt={alt} className={`${className}`} />
  )
}

export default ResponsiveImage