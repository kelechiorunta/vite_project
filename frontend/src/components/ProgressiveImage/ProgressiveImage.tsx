import React, { useState } from 'react';

export type ProgressiveImgPropTypes = {
    placeholderSrc: string;
    src: string;
    alt: string;
    style: object;
}

const ProgressiveImage = ({ placeholderSrc, src, alt, style }: ProgressiveImgPropTypes) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Placeholder image (blurred) */}
      <img
        src={placeholderSrc}
        alt={alt}
        style={{
          ...style,
          position: 'absolute',
          top: 0,
          left: 0,
          filter: 'blur(8px)',
          transition: 'opacity 0.3s ease',
          opacity: imgLoaded ? 0 : 1
        }}
      />

      {/* Full image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setImgLoaded(true)}
        style={{
          ...style,
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default ProgressiveImage;
