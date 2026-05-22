import React from 'react';
import { Icon } from '../ui/Icon';
import { notImplemented } from '../../lib/toast';

export interface AddressBarProps {
  address: string;
}

export function AddressBar({ address }: AddressBarProps) {
  return (
    <div style={{ background: 'var(--color-neutral-200)' }}>
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          fontSize: 14,
        }}
      >
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{address}</span>
        <button
          type="button"
          onClick={notImplemented}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-action-primary)',
            fontWeight: 500,
          }}
        >
          Подробнее о доме
          <Icon name="24-navigation-chevron-right" size={18} />
        </button>
      </div>
    </div>
  );
}
