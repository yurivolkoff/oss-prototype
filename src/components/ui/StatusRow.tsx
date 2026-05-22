import React from 'react';
import { Icon } from './Icon';
import { Pill } from './Pill';

type Tone = 'success' | 'warning' | 'error' | 'info';

export interface StatusRowProps {
  tone: Tone;
  rating?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  counter?: React.ReactNode;
  counterCaption?: React.ReactNode;
  cta?: React.ReactNode;
  showInfoIcon?: boolean;
  onInfoClick?: () => void;
  infoButtonRef?: React.Ref<HTMLButtonElement>;
}

export function StatusRow({
  tone,
  rating,
  title,
  description,
  counter,
  counterCaption,
  cta,
  showInfoIcon,
  onInfoClick,
  infoButtonRef,
}: StatusRowProps) {
  const iconName =
    tone === 'success'
      ? '24-status-ok'
      : tone === 'error'
        ? '24-status-error'
        : tone === 'warning'
          ? '24-status-error'
          : '24-status-information';

  const iconColor =
    tone === 'success'
      ? 'var(--color-success-500)'
      : tone === 'error'
        ? 'var(--color-error-500)'
        : tone === 'warning'
          ? 'var(--color-warning-600)'
          : 'var(--color-accent-600)';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: 12,
        alignItems: 'start',
        padding: '12px 0',
      }}
    >
      <span style={{ color: iconColor, paddingTop: 2 }}>
        <Icon name={iconName} size={24} />
      </span>
      <div style={{ minWidth: 0 }}>
        {rating && (
          <div style={{ marginBottom: 6 }}>
            <Pill tone={tone === 'info' ? 'info' : tone}>{rating}</Pill>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}>{title}</span>
          {showInfoIcon && (
            <button
              ref={infoButtonRef}
              type="button"
              onClick={onInfoClick}
              aria-label="Подробнее"
              style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}
            >
              <Icon name="24-status-information" size={18} />
            </button>
          )}
        </div>
        {description && (
          <div style={{ marginTop: 4, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {description}
          </div>
        )}
        {cta && <div style={{ marginTop: 8 }}>{cta}</div>}
      </div>
      {counter && (
        <div style={{ textAlign: 'right' }}>
          <div className="num-mono" style={{ fontSize: 18, fontWeight: 600 }}>
            {counter}
          </div>
          {counterCaption && (
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {counterCaption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
