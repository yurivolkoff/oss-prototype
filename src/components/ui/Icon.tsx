import React from 'react';

/**
 * CSS-mask based icon. Inherits color from `currentColor` so any wrapper
 * can recolor it via `color: var(--color-...)`.
 */
export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  ['aria-hidden']?: boolean;
  title?: string;
}

/**
 * Some SVGs in the design pack were exported in their canvas orientation
 * (ignoring the rotation applied inside Figma). We compensate via CSS.
 * — chevron-down/right share a path drawn as `>`; rotate 90deg CW for `v`.
 * — arrow-right was drawn as a vertical `↓`; rotate -90deg for `→`.
 */
const ROTATION_FIX: Record<string, number> = {
  // Source SVGs were exported in canvas orientation `<` (vertex on left side).
  '24-navigation-chevron-right': 180, // < → >
  '24-navigation-chevron-down': -90, // < → v   (CCW: vertex left → bottom)
  '24-navigation-chevron-up': 90, //  < → ^   (CW:  vertex left → top)
  '24-navigation-chevron-left': 0, // already <
  '24-navigation-arrow-right': -90, // ↓ → →
};

export function Icon({
  name,
  size = 24,
  className,
  style,
  ['aria-hidden']: ariaHidden = true,
  title,
}: IconProps): React.ReactElement {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const url = `${base}/assets/icons/${name}.svg`;
  const rotation = ROTATION_FIX[name];
  return (
    <span
      role={title ? 'img' : undefined}
      aria-hidden={ariaHidden}
      aria-label={title}
      className={`icon-mask${className ? ' ' + className : ''}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        ...style,
      }}
    />
  );
}
