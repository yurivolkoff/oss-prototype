import React from 'react';
import { Icon } from '../ui/Icon';
import { notImplemented } from '../../lib/toast';

const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-background-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        marginTop: 40,
        paddingBlock: 32,
        fontSize: 13,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Об операторе ГИС ЖКХ',
              'Техническая поддержка',
              'Вернуться на старый сайт',
              'Пройти онлайн-опрос',
            ].map((label) => (
              <li key={label}>
                <button type="button" onClick={notImplemented} style={{ color: 'var(--color-text-link)' }}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <img src={`${base}/assets/logos/partner-minstroy.svg`} alt="Минстрой" height={36} />
            <img src={`${base}/assets/logos/partner-mincifry.svg`} alt="Минцифры" height={36} />
            <img src={`${base}/assets/logos/partner-ois.svg`} alt="ОИС" height={36} />
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 12,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span>© 2026 Государственная информационная система ЖКХ</span>
          <span style={{ display: 'inline-flex', gap: 16, alignItems: 'center', color: 'var(--color-action-primary)' }}>
            <button type="button" onClick={notImplemented} aria-label="ВКонтакте" style={{ color: 'inherit' }}>
              <Icon name="24-social-vkontakte" size={22} />
            </button>
            <button type="button" onClick={notImplemented} aria-label="Одноклассники" style={{ color: 'inherit' }}>
              <Icon name="24-social-odnoklassniki" size={22} />
            </button>
            <button type="button" onClick={notImplemented} aria-label="Telegram" style={{ color: 'inherit' }}>
              <Icon name="24-social-telegram" size={22} />
            </button>
            <a
              href="https://dom.gosuslugi.ru/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-action-primary)', fontWeight: 500 }}
            >
              Скачать приложение ↗
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
