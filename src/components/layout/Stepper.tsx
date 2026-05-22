import React from 'react';
import { Icon } from '../ui/Icon';

export interface StepperStep {
  label: string;
  state: 'pending' | 'active' | 'completed';
}

export interface StepperProps {
  steps: StepperStep[];
  onStepClick?: (idx: number) => void;
}

export function Stepper({ steps, onStepClick }: StepperProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
        alignItems: 'flex-start',
        gap: 0,
        padding: '20px 0 8px',
      }}
    >
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const isInteractive = s.state === 'completed';
        const circle = (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '50%',
              border:
                s.state === 'active'
                  ? '2px solid var(--color-action-primary)'
                  : s.state === 'completed'
                    ? '2px solid var(--color-action-primary)'
                    : '1px solid var(--color-neutral-400)',
              background:
                s.state === 'completed' ? 'var(--color-action-primary)' : 'transparent',
              color:
                s.state === 'completed'
                  ? '#fff'
                  : s.state === 'active'
                    ? 'var(--color-action-primary)'
                    : 'var(--color-text-muted)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {s.state === 'completed' ? <Icon name="24-status-ok" size={16} /> : i + 1}
          </span>
        );
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              fontSize: 11,
              color:
                s.state === 'active' || s.state === 'completed'
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-muted)',
              gap: 6,
              minHeight: 60,
            }}
          >
            {!isLast && (
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 13,
                  left: '50%',
                  right: '-50%',
                  height: 2,
                  background:
                    steps[i + 1].state === 'pending'
                      ? 'var(--color-neutral-300)'
                      : 'var(--color-action-primary)',
                  zIndex: 0,
                }}
              />
            )}
            {isInteractive ? (
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  background: 'var(--color-background-page)',
                  borderRadius: '50%',
                  padding: 2,
                }}
              >
                {circle}
              </button>
            ) : (
              <span style={{ position: 'relative', zIndex: 1, background: 'var(--color-background-page)', borderRadius: '50%', padding: 2 }}>
                {circle}
              </span>
            )}
            <span
              style={{
                lineHeight: '14px',
                textAlign: 'center',
                paddingInline: 4,
                fontWeight: s.state === 'active' ? 600 : 400,
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const STEPPER_LABELS = [
  'Подготовка данных по дому',
  'Формирование повестки',
  'Уведомление о начале собрания',
  'Старт голосования',
  'Завершение голосования',
  'Размещение информации',
];
