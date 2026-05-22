import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { notImplemented } from '../../lib/toast';

export function AppHeader() {
  const navigate = useNavigate();
  return (
    <header
      style={{
        background: 'var(--color-background-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 16px',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="На главную"
          style={{ display: 'inline-flex' }}
        >
          <span className="logo-dom">
            <span className="logo-dom__brand">госуслуги</span>
            <span className="logo-dom__product">дом</span>
          </span>
        </button>
        <span aria-hidden style={{ width: 1, height: 36, background: 'var(--color-neutral-300)' }} />
        <span
          style={{
            fontSize: 11,
            lineHeight: '14px',
            color: 'var(--color-text-secondary)',
            maxWidth: 280,
          }}
        >
          Государственная информационная система ЖКХ
        </span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 16 }}>
          <button
            type="button"
            onClick={notImplemented}
            aria-label="Поиск"
            style={{ color: 'var(--color-action-primary)', display: 'inline-flex' }}
          >
            <Icon name="search" size={22} />
          </button>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--color-text-primary)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <button type="button" onClick={notImplemented} style={{ color: 'inherit' }}>
              Елизавета К.
            </button>
            <button
              type="button"
              onClick={notImplemented}
              aria-label="Выйти из аккаунта"
              style={{ color: 'var(--color-action-primary)', display: 'inline-flex' }}
            >
              <Icon name="24-actions-sign-out" size={22} />
            </button>
          </span>
        </span>
      </div>
    </header>
  );
}
