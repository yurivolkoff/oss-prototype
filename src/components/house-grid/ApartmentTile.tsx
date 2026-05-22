import React from 'react';
import { Icon } from '../ui/Icon';
import type { Premise } from '../../lib/types';

export interface ApartmentTileProps {
  premise: Premise;
  onClick: () => void;
}

/**
 * Apartment tile in the шахматка grid. Fixed 88px tall AND single-column width
 * regardless of text content.
 *
 * Visual rules (per Figma + user feedback):
 * - top-right corner: ↗ link-arrow on EVERY tile (ok / warning / error)
 * - bottom-left: status indicator + text label
 *     - ok      → 🔑 link icon + «кадастровый номер»
 *     - warning → 🟡 ! circle  + «{warningNote}»
 *     - error   → 🔴 ! circle  + «не связан с помещением»
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
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        color: 'var(--color-text-primary)',
        transition: 'border-color .15s, transform .1s, box-shadow .15s',
        overflow: 'hidden',
      }}
    >
      {/* Top-right: always the diagonal arrow ↗ */}
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
          display: 'flex',
          alignItems: 'center',
          gap: 6,
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
        {tone === 'ok' ? (
          <Icon
            name="24-actions-attachment-link"
            size={12}
            style={{ color: 'inherit', flexShrink: 0 }}
          />
        ) : (
          <AlertCircle tone={tone} />
        )}
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
          title={bottomLabel}
        >
          {bottomLabel}
        </span>
      </span>
    </button>
  );
}

function AlertCircle({ tone }: { tone: 'warning' | 'error' }) {
  const bg = tone === 'warning' ? 'var(--color-warning-500)' : 'var(--color-error-500)';
  return (
    <span
      aria-hidden
      style={{
        flexShrink: 0,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: bg,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      !
    </span>
  );
}
