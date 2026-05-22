import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Accordion } from '../components/ui/Accordion';
import { BackLink } from '../components/ui/BackLink';
import { KeyValueRow } from '../components/ui/KeyValueRow';
import { InfoBlock } from '../components/ui/InfoBlock';
import { Icon } from '../components/ui/Icon';
import { Popover } from '../components/ui/Popover';
import { STEPPER_LABELS } from '../components/layout/Stepper';

import { useMeetingStore } from '../lib/store';
import { notImplemented } from '../lib/toast';

export function PrepHouseAScreen() {
  const navigate = useNavigate();
  const { meeting, goToHouseB } = useMeetingStore();
  const [popover, setPopover] = useState<{ open: boolean; rect: DOMRect | null }>({
    open: false,
    rect: null,
  });
  const infoBtnRef = useRef<HTMLButtonElement>(null);

  const handleNext = () => {
    goToHouseB();
    navigate('/oss/new/house-b');
  };

  const steps = STEPPER_LABELS.map((label, i) => ({
    label,
    state: i === 0 ? ('active' as const) : ('pending' as const),
  }));

  return (
    <PageShell address={meeting.house.address} showStepper steps={steps}>
      <div style={{ marginTop: 8 }}>
        <BackLink onClick={() => navigate('/')} />
      </div>

      <h1 style={{ margin: '16px 0 8px', fontSize: 26, fontWeight: 600 }}>
        Подготовка данных по дому 1/2
      </h1>
      <p style={{ margin: '0 0 20px', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: '20px' }}>
        Перед началом собрания проверьте, что данные о доме в ГИС ЖКХ актуальны.
        Если найдёте ошибку — отправьте обращение в Росреестр до публикации
        уведомления о собрании.
      </p>

      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Общая информация о доме</h2>
        <div style={{ marginTop: 4, fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {meeting.house.address}
        </div>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 0',
            color: 'var(--color-success-700)',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Icon name="24-status-ok" size={20} style={{ color: 'var(--color-success-500)' }} />
          Площадь помещений совпадает с реестром
          <button
            ref={infoBtnRef}
            type="button"
            onClick={() => {
              const rect = infoBtnRef.current?.getBoundingClientRect() ?? null;
              setPopover({ open: !popover.open, rect });
            }}
            aria-label="Подробнее о совпадении площади"
            style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}
          >
            <Icon name="24-status-information" size={18} />
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <KeyValueRow label="Общая площадь помещений" value={`${meeting.house.totalArea} м²`} />
          <KeyValueRow label="Общая площадь жилых помещений" value={`${meeting.house.totalArea} м²`} />
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
          данные обновлены 09.04.2022
        </div>

        <div
          style={{
            marginTop: 20,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <KvBox label="Кадастровый номер дома" value={meeting.house.cadastralNumber} />
          <KvBox label="Идентификационный код адреса" value={meeting.house.addressCode} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Accordion variant="plain" title="Документы">
            <DocumentsTable />
          </Accordion>
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <InfoBlock>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ fontWeight: 500 }}>Нашли ошибку?</span>
            <button
              type="button"
              onClick={notImplemented}
              style={{ color: 'var(--color-action-primary)', fontWeight: 500 }}
            >
              Направить обращение Росреестр
            </button>
          </div>
        </InfoBlock>
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" onClick={handleNext}>
          Верно, далее
        </Button>
      </div>

      <Popover
        open={popover.open}
        anchorRect={popover.rect}
        onClose={() => setPopover({ open: false, rect: null })}
      >
        <p style={{ margin: 0 }}>
          Площадь жилых и нежилых помещений в ГИС ЖКХ совпадает с данными
          Росреестра. Это важно для корректного расчёта голосов: каждый
          собственник голосует пропорционально своей доле от общей площади.
        </p>
      </Popover>
    </PageShell>
  );
}

function KvBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--color-background-surface-subtle)',
        borderRadius: 12,
        padding: '12px 14px',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
        {label}
      </div>
      <div className="num-mono" style={{ fontSize: 14, fontFamily: 'ui-monospace, "SF Mono", Consolas, monospace' }}>
        {value}
      </div>
    </div>
  );
}

function DocumentsTable() {
  const rows = [
    { name: 'Технический паспорт МКД.pdf', date: '12.05.2018', action: 'download' as const },
    { name: 'Постановление №1234.pdf', date: '03.11.2020', action: 'link' as const },
    { name: 'Акт обследования.pdf', date: '09.04.2022', action: 'download' as const },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
            <td style={{ padding: '10px 0' }}>{r.name}</td>
            <td className="num-mono" style={{ padding: '10px 0', color: 'var(--color-text-secondary)' }}>
              {r.date}
            </td>
            <td style={{ padding: '10px 0', textAlign: 'right' }}>
              <button
                type="button"
                onClick={notImplemented}
                aria-label={r.action === 'download' ? 'Скачать' : 'Открыть'}
                style={{ color: 'var(--color-action-primary)', display: 'inline-flex' }}
              >
                <Icon
                  name={r.action === 'download' ? '24-actions-download' : '24-actions-attachment-link'}
                  size={20}
                />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
