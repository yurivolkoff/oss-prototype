import React from 'react';

export interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        padding: '0 14px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        background: active ? 'var(--color-accent-600)' : 'var(--color-neutral-100)',
        color: active ? '#fff' : 'var(--color-text-primary)',
        border: '1px solid transparent',
        transition: 'background-color .15s, color .15s',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
