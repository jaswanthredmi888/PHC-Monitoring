import React, { useState } from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const [imgSrc, setImgSrc] = useState('https://sevalink.wuaze.com/logo.png');

  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeMap[size]} relative shrink-0 rounded-full overflow-hidden border border-pink-200/80 shadow-xs bg-pink-50/50 flex items-center justify-center`}>
        <img
          src={imgSrc}
          alt="SevaLink PHC Logo"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc('/logo.png')}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight leading-tight">
            <span className="text-orange-500">SEVA</span>
            <span className="text-green-600">Link</span>{' '}
            <span className="text-black">Monitoring</span>
          </span>
          <span className="text-[10px] font-semibold text-blue-600 font-mono">
            Health Portal
          </span>
        </div>
      )}
    </div>
  );
};
