import React, { useState } from 'react';
import { Landmark } from 'lucide-react';

interface HeritageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackName?: string;
}

export const HeritageImage: React.FC<HeritageImageProps> = ({
  src,
  alt,
  className = '',
  fallbackName = 'Heritage Site',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div 
        className={`${className} bg-[#ede3d1] flex flex-col items-center justify-center p-6 border border-[#aa7b3f]/20 relative overflow-hidden select-none`}
        style={{ minHeight: '100%' }}
      >
        {/* Subtle decorative background grids */}
        <div className="absolute inset-0 opacity-5 border border-dashed border-[#aa7b3f] m-4 rounded-xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#b65a3a]/5 rounded-full blur-2xl pointer-events-none" />
        
        <Landmark className="w-8 h-8 text-[#b65a3a] opacity-60 mb-2" />
        <span className="font-display text-[11px] font-bold text-[#4b2f23] tracking-wide text-center uppercase max-w-[90%] line-clamp-1">
          {fallbackName}
        </span>
        <span className="font-subheading text-[8px] text-[#b65a3a]/70 uppercase tracking-widest mt-1">
          Dharohar Digital Twin
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
