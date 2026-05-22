import React from 'react';

export interface InfoBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function InfoBlock({ children, className }: InfoBlockProps) {
  return (
    <div
      className={className}
      style={{
        background: '#EFE9FF',
        borderRadius: 12,
        padding: '16px 20px',
        color: 'var(--color-text-primary)',
        fontSize: 14,
        lineHeight: '20px',
      }}
    >
      {children}
    </div>
  );
}
