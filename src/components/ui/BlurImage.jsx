import { useState, useRef, useEffect } from 'react'

export function BlurImage({ src, alt, className, style, imgStyle, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // Handle already-cached images: img.complete is true before onLoad fires
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: loaded ? 'none' : 'blur(14px)',
          transform: loaded ? 'scale(1)' : 'scale(1.06)',
          transition: 'filter 0.55s ease, transform 0.55s ease',
          willChange: 'filter, transform',
          ...imgStyle,
        }}
        {...rest}
      />
    </div>
  )
}
