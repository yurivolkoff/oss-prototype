import React from 'react';
import { Icon } from './Icon';

export interface Tab {
  key: string;
  label: string;
  state: 'verified' | 'pending';
}

export interface TabBarProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, activeKey, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 4,
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--color-action-primary)' : 'var(--color-text-secondary)',
              borderBottom: active ? '2px solid var(--color-action-primary)' : '2px solid transparent',
              marginBottom: -1,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {t.label}
            <span
              style={{
                color:
                  t.state === 'verified'
                    ? 'var(--color-success-500)'
                    : 'var(--color-text-muted)',
                display: 'inline-flex',
              }}
            >
              <Icon
                name={t.state === 'verified' ? '24-status-ok' : '24-entity-time-large'}
                size={16}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
