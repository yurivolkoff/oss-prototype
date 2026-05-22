import React from 'react';
import type { Premise } from '../../lib/types';
import { ApartmentTile } from './ApartmentTile';
import { NonResidentialTile } from './NonResidentialTile';

export interface HouseGridProps {
  premises: Premise[];
  onPremiseClick: (p: Premise) => void;
}

interface GroupKey {
  entrance: number;
  floor: number;
}

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

export function HouseGrid({ premises, onPremiseClick }: HouseGridProps) {
  const apartments = premises.filter((p) => p.type === 'apartment');
  const nonResidential = premises.filter((p) => p.type === 'non_residential');
  const groups = groupApartments(apartments);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {groups.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          По заданным фильтрам ничего не найдено
        </div>
      ) : (
        groups.map((g) => (
          <section key={`${g.key.entrance}-${g.key.floor}`}>
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              Подъезд {g.key.entrance}, этаж {g.key.floor}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
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

      {nonResidential.length > 0 && (
        <section>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>
            Нежилые помещения
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
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
