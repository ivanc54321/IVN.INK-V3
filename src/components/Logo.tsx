import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/ivn_logo_2.png" alt="IVN.INK Logo" className="h-full w-auto object-contain" />
    </div>
  );
}
