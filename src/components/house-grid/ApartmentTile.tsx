import React from 'react';
import { Icon } from '../ui/Icon';
import type { Premise } from '../../lib/types';

export interface ApartmentTileProps {
  premise: Premise;
  onClick: () => void;
}

export function ApartmentTile({ premise, onClick }: ApartmentTileProps) {
  const tone = premise.status;
  const bg =
    tone === 'ok'
      ? 'var(--color-background-surface)'
      : tone === 'warning'
        ? 'var(--color-warning-50)'
        : 'var(--color-error-50)';
  const border =
    tone === 'ok'
      ? '1px solid var(--color-border-subtle)'
      : tone === 'warning'
        ? '1px solid var(--color-warning-200)'
        : '1px solid var(--color-error-200)';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Квартира №${premise.number}, ${premise.area} м²${tone !== 'ok' ? ', есть проблема' : ''}`}
      style={{
        position: 'relative',
        textAlign: 'left',
        background: bg,
        border,
        borderRadius: 12,
        padding: 12,
        height: 110,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        cursor: 'pointer',
        color: 'var(--color-text-primary)',
        transition: 'transform .1s ease',
      }}
    >
      {tone !== 'ok' && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: tone === 'warning' ? 'var(--color-warning-500)' : 'var(--color-error-500)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          !
        </span>
      )}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          color: 'var(--color-text-muted)',
          display: 'inline-flex',
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600 }}>Кв. №{premise.number}</span>
      <span className="num-mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
        {premise.area} м²
      </span>
      <span
        style={{
          marginTop: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: tone === 'ok' ? 'var(--color-text-muted)' : tone === 'warning' ? 'var(--color-warning-700)' : 'var(--color-error-700)',
          lineHeight: '14px',
        }}
      >
        <Icon
          name={premise.cadastralLinked ? '24-actions-attachment-link' : '24-actions-close'}
          size={14}
          style={{ color: 'inherit' }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {premise.cadastralLinked
            ? premise.cadastralNumber.split(':').slice(-1)[0]
            : premise.warningNote ?? 'кадастровый номер не связан'}
        </span>
      </span>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 8,
          right: tone !== 'ok' ? 28 : 8,
          color: 'var(--color-action-primary)',
          display: 'inline-flex',
        }}
      >
        <Icon name="24-navigation-arrow-right" size={16} style={{ color: 'inherit' }} />
      </span>
    </button>
  );
}
