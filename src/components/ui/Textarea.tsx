import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  maxLength?: number;
  value: string;
  onValueChange: (v: string) => void;
}

export function Textarea({
  label,
  maxLength = 3000,
  value,
  onValueChange,
  id,
  style,
  rows = 4,
  ...rest
}: TextareaProps) {
  const inputId = id || React.useId();
  return (
    <label htmlFor={inputId} style={{ display: 'block', position: 'relative' }}>
      {label && (
        <span
          style={{
            display: 'block',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      )}
      <textarea
        id={inputId}
        {...rest}
        rows={rows}
        value={value}
        onChange={(e) => {
          const next = e.target.value.slice(0, maxLength);
          onValueChange(next);
        }}
        style={{
          display: 'block',
          width: '100%',
          background: 'var(--color-background-surface-subtle)',
          border: '1px solid transparent',
          borderRadius: 12,
          padding: '12px 14px',
          fontSize: 15,
          color: 'var(--color-text-primary)',
          outline: 'none',
          resize: 'vertical',
          minHeight: rows * 22 + 24,
          ...style,
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: 12,
          bottom: 10,
          fontSize: 12,
          color: 'var(--color-text-muted)',
        }}
      >
        {value.length}/{maxLength}
      </span>
    </label>
  );
}
