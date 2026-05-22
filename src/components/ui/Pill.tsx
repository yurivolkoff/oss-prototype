import React from 'react';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface PillProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const tones: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: 'var(--color-success-50)', fg: 'var(--color-success-700)' },
  warning: { bg: 'var(--color-warning-50)', fg: 'var(--color-warning-700)' },
  error: { bg: 'var(--color-error-50)', fg: 'var(--color-error-700)' },
  info: { bg: 'var(--color-accent-100)', fg: 'var(--color-accent-700)' },
  neutral: { bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-700)' },
};

export function Pill({ tone = 'neutral', children, className, style }: PillProps) {
  const t = tones[tone];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 10px',
        borderRadius: 999,
        fontSize: 13,
        lineHeight: 1,
        fontWeight: 500,
        background: t.bg,
        color: t.fg,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
