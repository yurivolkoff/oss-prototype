import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { StatusRow } from '../components/ui/StatusRow';
import { Select } from '../components/ui/Select';
import { FilterChip } from '../components/ui/FilterChip';
import { Popover } from '../components/ui/Popover';
import { HouseGrid } from '../components/house-grid/HouseGrid';
import { ApartmentModal } from './ApartmentModal';
import { STEPPER_LABELS } from '../components/layout/Stepper';

import { useMeetingStore } from '../lib/store';
import { notImplemented } from '../lib/toast';
import type { Premise, PremiseIssue } from '../lib/types';

type FilterFlag = 'no_cadastral' | 'wrong_area' | 'duplicate';

export function PrepHouseBScreen() {
  const navigate = useNavigate();
  const { meeting, completeStep1 } = useMeetingStore();

  const [type, setType] = useState<'all' | 'apartment' | 'non_residential'>('all');
  const [floor, setFloor] = useState<string>('all');
  const [entrance, setEntrance] = useState<string>('all');
  const [chips, setChips] = useState<Set<FilterFlag>>(new Set());

  const [activePremise, setActivePremise] = useState<Premise | null>(null);
  const [popover, setPopover] = useState<{ open: boolean; rect: DOMRect | null }>({
    open: false,
    rect: null,
  });
  const infoBtnRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleChip = (k: FilterFlag) => {
    setChips((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return meeting.premises.filter((p) => {
      if (type !== 'all' && p.type !== type) return false;
      if (type === 'all' && p.type === 'non_residential') {
        // Non-residential block is shown separately; allow when no filters applied
      }
      if (floor !== 'all' && p.type === 'apartment' && p.floor !== Number(floor)) return false;
      if (entrance !== 'all' && p.type === 'apartment' && p.entrance !== Number(entrance)) return false;
      if (chips.size > 0) {
        const has = (i: PremiseIssue) => p.issues.includes(i);
        const anyMatch =
          (chips.has('no_cadastral') && has('no_cadastral')) ||
          (chips.has('wrong_area') && has('wrong_area')) ||
          (chips.has('duplicate') && has('duplicate'));
        if (!anyMatch) return false;
      }
      return true;
    });
  }, [meeting.premises, type, floor, entrance, chips]);

  const handleContinue = () => {
    completeStep1();
    navigate('/oss/new/module-2');
  };

  const steps = STEPPER_LABELS.map((label, i) => ({
    label,
    state: i === 0 ? ('active' as const) : ('pending' as const),
  }));

  return (
    <PageShell address={meeting.house.address} showStepper steps={steps}>
      <div style={{ marginTop: 8 }}>
        <BackLink onClick={() => navigate('/oss/new/house-a')} />
      </div>

      <h1 style={{ margin: '16px 0 8px', fontSize: 26, fontWeight: 600 }}>
        Подготовка данных по дому 2/2
      </h1>
      <p style={{ margin: '0 0 20px', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: '20px' }}>
        Проверьте, что все помещения в доме связаны с актуальными данными
        из Росреестра. От этого зависит, как система посчитает кворум
        и учтёт голоса собственников.
      </p>

      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Дополнительная информация о доме</h2>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
          <StatusRow
            tone="success"
            rating="хорошая оценка"
            title="Кадастровые номера связаны с помещениями в ГИС ЖКХ"
            description="данные обновлены 18.03.2000"
            counter="116 из 120"
            counterCaption="помещений"
            showInfoIcon
            infoButtonRef={infoBtnRef}
            onInfoClick={() => {
              const rect = infoBtnRef.current?.getBoundingClientRect() ?? null;
              setPopover({ open: !popover.open, rect });
            }}
            cta={
              <button
                type="button"
                onClick={notImplemented}
                className="link-hover"
                style={{ color: 'var(--color-action-primary)', fontSize: 14, fontWeight: 500 }}
              >
                Связать кадастровые номера
              </button>
            }
          />
          <StatusRow
            tone="error"
            rating="обратите внимание"
            title="Задублированные помещения"
            counter="98"
            counterCaption="помещений"
            cta={
              <button
                type="button"
                onClick={() => {
                  // прокрутить к шахматке и активировать chip "дубль"
                  setChips(new Set(['duplicate']));
                  gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="link-hover"
                style={{ color: 'var(--color-action-primary)', fontSize: 14, fontWeight: 500 }}
              >
                Внести изменения
              </button>
            }
          />
        </div>
      </Card>

      <Card ref={gridRef} style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>«Шахматка» по дому</h2>

        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          <Select
            label="Тип помещения"
            value={type}
            onChange={(v) => setType(v as typeof type)}
            options={[
              { value: 'all', label: 'все' },
              { value: 'apartment', label: 'жилые' },
              { value: 'non_residential', label: 'нежилые' },
            ]}
          />
          <Select
            label="Этаж"
            value={floor}
            onChange={setFloor}
            options={[
              { value: 'all', label: 'все' },
              ...Array.from({ length: 5 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
            ]}
          />
          <Select
            label="Подъезд"
            value={entrance}
            onChange={setEntrance}
            placeholder="—"
            options={[
              { value: 'all', label: 'все' },
              ...Array.from({ length: 6 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
            ]}
          />
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Проблема с данными:</span>
          <FilterChip active={chips.has('no_cadastral')} onClick={() => toggleChip('no_cadastral')}>
            кадастровый номер
          </FilterChip>
          <FilterChip active={chips.has('wrong_area')} onClick={() => toggleChip('wrong_area')}>
            площадь помещения
          </FilterChip>
          <FilterChip active={chips.has('duplicate')} onClick={() => toggleChip('duplicate')}>
            дубль
          </FilterChip>
        </div>

        <div style={{ marginTop: 20 }}>
          <HouseGrid
            premises={filtered}
            onPremiseClick={(p) => {
              if (p.type === 'non_residential') {
                notImplemented();
                return;
              }
              setActivePremise(p);
            }}
          />
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <Button variant="primary" onClick={handleContinue}>
            Продолжить
          </Button>
        </div>
      </Card>

      <Popover
        open={popover.open}
        anchorRect={popover.rect}
        onClose={() => setPopover({ open: false, rect: null })}
      >
        <p style={{ margin: 0 }}>
          Связь помещения с записью в Росреестре по кадастровому номеру позволяет
          ГИС ЖКХ автоматически определить собственника и его долю в праве.
          Без этой связи голос собственника не учтётся при подсчёте кворума.
        </p>
        <p style={{ margin: '8px 0 0', color: 'var(--color-text-muted)' }}>
          Если связь не установлена — выберите помещение в шахматке и привяжите
          кадастровый номер вручную.
        </p>
      </Popover>

      <ApartmentModal
        premise={activePremise}
        onClose={() => setActivePremise(null)}
      />
    </PageShell>
  );
}
