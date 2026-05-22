import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { notImplemented } from '../../lib/toast';

const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

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
          aria-label="Госуслуги.Дом — на главную"
          style={{ display: 'inline-flex' }}
        >
          <img
            src={`${base}/assets/logos/gosuslugi-dom.svg`}
            alt="Госуслуги.Дом"
            height={32}
          />
        </button>
        <img
          src={`${base}/assets/logos/gis-zhkh.svg`}
          alt="Государственная информационная система ЖКХ"
          height={32}
        />
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
