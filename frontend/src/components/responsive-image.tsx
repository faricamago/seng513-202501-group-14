import React from 'react'

interface ResponsiveImageProps {
    src: string;
    alt: string;
    className?: string;
}


const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  return (
    <img src={src} alt={alt} className={`${className}`} />
  )
}

export default ResponsiveImage