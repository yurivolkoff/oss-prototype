import React from 'react';
import { Icon } from '../ui/Icon';
import type { Premise } from '../../lib/types';

export interface NonResidentialTileProps {
  premise: Premise;
  onClick: () => void;
}

export function NonResidentialTile({ premise, onClick }: NonResidentialTileProps) {
  const isError = premise.status === 'error';
  return (
    <button
      type="button"
      onClick={onClick}
      className="tile tile--ok"
      style={{
        position: 'relative',
        textAlign: 'left',
        background: isError ? 'var(--color-error-50)' : 'var(--color-background-surface)',
        border: isError ? '1px solid var(--color-error-200)' : '1px solid var(--color-border-subtle)',
        borderRadius: 12,
        padding: '10px 12px',
        height: 88,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color .15s, transform .1s, box-shadow .15s',
      }}
    >
      {isError ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'var(--color-error-500)',
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
      ) : (
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
      )}
      <span style={{ fontSize: 13, fontWeight: 600 }}>{premise.number}</span>
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
          color: isError ? 'var(--color-error-700)' : 'var(--color-text-muted)',
          lineHeight: '14px',
        }}
      >
        <Icon
          name={isError ? '24-actions-close' : '24-actions-attachment-link'}
          size={12}
          style={{ color: 'inherit', flexShrink: 0 }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isError ? 'нет кадастрового номера' : 'кадастровый номер'}
        </span>
      </span>
    </button>
  );
}
