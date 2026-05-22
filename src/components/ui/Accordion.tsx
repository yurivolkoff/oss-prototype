import React, { useState } from 'react';
import { Icon } from './Icon';

export interface AccordionProps {
  /** Numbered = синий-кружок с цифрой; plain = простой заголовок */
  variant?: 'numbered' | 'plain';
  number?: number | string;
  title: React.ReactNode;
  defaultOpen?: boolean;
  /** Disabled = только показывает toast/нет body; используется для inactive блоков */
  disabled?: boolean;
  onDisabledClick?: () => void;
  /** При open=undefined — компонент держит state сам. Иначе controlled. */
  open?: boolean;
  onToggle?: (next: boolean) => void;
  children?: React.ReactNode;
  /** Дополнительный контент справа от заголовка (pill, status) */
  rightSlot?: React.ReactNode;
}

export function Accordion({
  variant = 'numbered',
  number,
  title,
  defaultOpen = false,
  disabled = false,
  onDisabledClick,
  open: controlledOpen,
  onToggle,
  children,
  rightSlot,
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? !!controlledOpen : internalOpen;

  const handleClick = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div
      style={{
        background: 'var(--color-background-surface)',
        borderRadius: 16,
        boxShadow: '0 1px 2px rgba(11, 17, 23, 0.04)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          padding: '20px 24px',
          textAlign: 'left',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
        }}
      >
        {variant === 'numbered' && number !== undefined && (
          <span
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-action-primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {number}
          </span>
        )}
        <span style={{ flex: 1, fontSize: 16, fontWeight: 600, lineHeight: '24px' }}>
          {title}
        </span>
        {rightSlot}
        <Icon
          name={isOpen ? '24-navigation-chevron-up' : '24-navigation-chevron-down'}
          size={24}
          style={{ color: 'var(--color-text-secondary)' }}
        />
      </button>
      {isOpen && children && (
        <div style={{ padding: '0 24px 24px' }}>{children}</div>
      )}
    </div>
  );
}
