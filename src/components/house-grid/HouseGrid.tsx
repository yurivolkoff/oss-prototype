import React, { useState } from 'react';
import type { Premise } from '../../lib/types';
import { ApartmentTile } from './ApartmentTile';
import { NonResidentialTile } from './NonResidentialTile';
import { Button } from '../ui/Button';

export interface HouseGridProps {
  premises: Premise[];
  onPremiseClick: (p: Premise) => void;
}

interface GroupKey {
  entrance: number;
  floor: number;
}

const INITIAL_TILE_LIMIT = 25;

function groupApartments(list: Premise[]): Array<{ key: GroupKey; items: Premise[] }> {
  const map = new Map<string, { key: GroupKey; items: Premise[] }>();
  for (const p of list) {
    const k = `${p.entrance}-${p.floor}`;
    if (!map.has(k)) {
      map.set(k, { key: { entrance: p.entrance, floor: p.floor }, items: [] });
    }
    map.get(k)!.items.push(p);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.key.entrance === b.key.entrance ? a.key.floor - b.key.floor : a.key.entrance - b.key.entrance
  );
}

/** Take groups until we accumulate at least `limit` tiles; never split a group. */
function takeUntilLimit(
  groups: Array<{ key: GroupKey; items: Premise[] }>,
  limit: number
) {
  const out: typeof groups = [];
  let count = 0;
  for (const g of groups) {
    out.push(g);
    count += g.items.length;
    if (count >= limit) break;
  }
  return { visible: out, total: groups.reduce((n, g) => n + g.items.length, 0) };
}

export function HouseGrid({ premises, onPremiseClick }: HouseGridProps) {
  const [expanded, setExpanded] = useState(false);
  const apartments = premises.filter((p) => p.type === 'apartment');
  const nonResidential = premises.filter((p) => p.type === 'non_residential');
  const groups = groupApartments(apartments);

  const { visible, total } = expanded
    ? { visible: groups, total: apartments.length }
    : takeUntilLimit(groups, INITIAL_TILE_LIMIT);
  const shownTiles = visible.reduce((n, g) => n + g.items.length, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {groups.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          По заданным фильтрам ничего не найдено
        </div>
      ) : (
        visible.map((g) => (
          <section key={`${g.key.entrance}-${g.key.floor}`}>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Подъезд {g.key.entrance}, этаж {g.key.floor}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 12,
              }}
            >
              {g.items.map((p) => (
                <ApartmentTile key={p.id} premise={p} onClick={() => onPremiseClick(p)} />
              ))}
            </div>
          </section>
        ))
      )}

      {!expanded && shownTiles < total && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button variant="secondary" onClick={() => setExpanded(true)}>
            Показать ещё {total - shownTiles}
          </Button>
        </div>
      )}

      {nonResidential.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }}>
            Нежилые помещения
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {nonResidential.map((p) => (
              <NonResidentialTile key={p.id} premise={p} onClick={() => onPremiseClick(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
