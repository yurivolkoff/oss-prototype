import React from 'react';
import { Icon } from '../ui/Icon';
import type { Premise } from '../../lib/types';

export interface ApartmentTileProps {
  premise: Premise;
  onClick: () => void;
}

/**
 * Apartment tile in the шахматка grid. Fixed 88px tall to keep groups visually aligned.
 *
 * Visual rules (per Figma):
 * - normal:  white bg, link-arrow ↗ in top-right corner
 * - warning: amber bg, red `!` circle in top-right (no arrow)
 * - error:   pink bg, red `!` circle in top-right (no arrow)
 * - bottom row: static label "кадастровый номер" (with key icon for ok, ✕ for error)
 */
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

  const bottomIcon =
    tone === 'ok'
      ? '24-actions-attachment-link'
      : '24-actions-close';
  const bottomLabel =
    tone === 'ok'
      ? 'кадастровый номер'
      : tone === 'warning'
        ? premise.warningNote ?? 'площадь расходится с реестром'
        : 'кадастровый номер не связан с помещением';

  const ariaLabel = `Квартира ${premise.number}, ${premise.area} м²${tone !== 'ok' ? ', есть проблема' : ''}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`tile tile--${tone}`}
      style={{
        position: 'relative',
        textAlign: 'left',
        background: bg,
        border,
        borderRadius: 12,
        padding: '10px 12px',
        height: 88,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        color: 'var(--color-text-primary)',
        transition: 'border-color .15s, transform .1s, box-shadow .15s',
      }}
    >
      {/* Top-right indicator: either link-arrow (normal) or red ! (problem) */}
      {tone === 'ok' ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'var(--color-action-primary)',
            display: 'inline-flex',
          }}
        >
          <Icon name="link-arrow" size={12} style={{ color: 'inherit' }} />
        </span>
      ) : (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background:
              tone === 'warning' ? 'var(--color-warning-500)' : 'var(--color-error-500)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          !
        </span>
      )}

      <span style={{ fontSize: 13, fontWeight: 600 }}>Кв. {premise.number}</span>
      <span
        className="num-mono"
        style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}
      >
        {premise.area} м²
      </span>
      <span
        style={{
          marginTop: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color:
            tone === 'ok'
              ? 'var(--color-text-muted)'
              : tone === 'warning'
                ? 'var(--color-warning-700)'
                : 'var(--color-error-700)',
          lineHeight: '14px',
          minWidth: 0,
        }}
      >
        <Icon name={bottomIcon} size={12} style={{ color: 'inherit', flexShrink: 0 }} />
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {bottomLabel}
        </span>
      </span>
    </button>
  );
}
