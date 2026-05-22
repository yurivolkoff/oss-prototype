import React from 'react';
import { Icon } from '../ui/Icon';
import { notImplemented, useToastStore } from '../../lib/toast';
import { toggleHighContrast } from '../../lib/theme';

export function TopPromoBar() {
  return (
    <div
      style={{
        background: 'var(--color-background-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        fontSize: 12,
        color: 'var(--color-text-secondary)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '8px 16px',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-accent-100)',
            color: 'var(--color-accent-700)',
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          <Icon name="24-entity-internet" size={14} />
          Санкт-Петербург
        </span>
        <button
          type="button"
          onClick={() => {
            const next = toggleHighContrast();
            useToastStore
              .getState()
              .show(next ? 'Включена версия для слабовидящих' : 'Версия для слабовидящих выключена');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--color-text-secondary)',
          }}
        >
          <Icon name="16-actions-visually-impaired" size={16} />
          Версия для слабовидящих
        </button>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 16 }}>
          <button type="button" onClick={notImplemented} style={{ color: 'inherit' }}>
            Поддержка
          </button>
          <button type="button" onClick={notImplemented} style={{ color: 'inherit' }}>
            Вернуться на старый сайт
          </button>
        </span>
      </div>
    </div>
  );
}
