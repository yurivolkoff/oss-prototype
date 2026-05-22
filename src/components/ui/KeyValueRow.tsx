import React from 'react';

export interface KeyValueRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Use dotted leader between label and value (для экранов 02 etc.) */
  dotted?: boolean;
}

export function KeyValueRow({ label, value, dotted = true }: KeyValueRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        fontSize: 14,
        lineHeight: '20px',
        padding: '6px 0',
      }}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      {dotted && (
        <span
          aria-hidden
          style={{
            flex: 1,
            borderBottom: '1px dotted var(--color-neutral-400)',
            transform: 'translateY(-3px)',
          }}
        />
      )}
      <span
        className="num-mono"
        style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}
      >
        {value}
      </span>
    </div>
  );
}
