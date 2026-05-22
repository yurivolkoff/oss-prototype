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
      style={{
        textAlign: 'left',
        background: isError ? 'var(--color-error-50)' : 'var(--color-background-surface)',
        border: isError ? '1px solid var(--color-error-200)' : '1px solid var(--color-border-subtle)',
        borderRadius: 12,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600 }}>{premise.number}</span>
      <span className="num-mono" style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
        {premise.area} м²
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 11,
          color: isError ? 'var(--color-error-700)' : 'var(--color-text-muted)',
        }}
      >
        <Icon name="24-actions-attachment-link" size={14} style={{ color: 'inherit' }} />
        {premise.cadastralLinked ? premise.cadastralNumber : premise.warningNote ?? 'нет КН'}
      </span>
    </button>
  );
}
