'use client';

import Image from 'next/image';

interface SocietyLogoProps {
  name: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', px: 48, text: 'text-sm', padding: 'p-1' },
  md: { container: 'w-14 h-14', px: 56, text: 'text-xl', padding: 'p-1.5' },
  lg: { container: 'w-20 h-20', px: 80, text: 'text-2xl', padding: 'p-2' },
};

export function SocietyLogo({ name, icon, size = 'md' }: SocietyLogoProps) {
  const cfg = sizeConfig[size];

  return (
    <div className={`flex-shrink-0 ${cfg.container} rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden relative`}>
      {icon ? (
        <div className={`w-full h-full ${cfg.padding} flex items-center justify-center`}>
          <Image
            src={icon}
            alt={`${name} logo`}
            width={cfg.px}
            height={cfg.px}
            unoptimized={true}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              const parent = target.parentElement?.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="${cfg.text} font-bold font-mono text-primary">${name.substring(0, 2).toUpperCase()}</span>`;
              }
            }}
          />
        </div>
      ) : (
        <span className={`${cfg.text} font-bold font-mono text-primary`}>
          {name.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
