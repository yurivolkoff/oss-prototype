import React from 'react';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, value, onChange, options, placeholder }: SelectProps) {
  return (
    <label style={{ display: 'block' }}>
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
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'var(--color-background-surface-subtle)',
            border: '1px solid transparent',
            borderRadius: 12,
            padding: '10px 36px 10px 14px',
            fontSize: 14,
            color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            outline: 'none',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-secondary)',
            pointerEvents: 'none',
          }}
        >
          <Icon name="24-navigation-chevron-down" size={20} />
        </span>
      </div>
    </label>
  );
}
