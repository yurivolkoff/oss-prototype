import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Accordion } from '../components/ui/Accordion';
import { Pill } from '../components/ui/Pill';
import { Icon } from '../components/ui/Icon';
import { Select } from '../components/ui/Select';
import { Popover } from '../components/ui/Popover';

import { useMeetingStore } from '../lib/store';
import { notImplemented } from '../lib/toast';

const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

interface StatusRowItem {
  rating: 'хорошая оценка' | 'средняя оценка' | 'низкая оценка' | 'высокая оценка';
  tone: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  metric: string;
  metricCaption: string;
  hasInfoIcon?: boolean;
  infoBody?: React.ReactNode;
}

export function DashboardScreen() {
  const navigate = useNavigate();
  const { meeting, startMeeting } = useMeetingStore();

  const handleStart = () => {
    startMeeting();
    navigate('/oss/new/house-a');
  };

  return (
    <PageShell address={meeting.house.address}>
      {/* HERO */}
      <Card
        variant="accent"
        style={{
          padding: 32,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15, fontWeight: 600 }}>
            Общее собрание
            <br /> собственников
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: '20px', color: 'var(--color-text-secondary)' }}>
            Это механизм управления многоквартирным домом. Принимайте решения
            об эксплуатации, содержании и ремонте общей собственности
            многоквартирного дома вместе с соседями.
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <Button variant="primary" onClick={handleStart}>
              Начать собрание
            </Button>
            <Button variant="secondary" onClick={notImplemented}>
              Подробнее о собрании
            </Button>
          </div>
        </div>
        <img
          src={`${base}/assets/illustrations/hero-oss.png`}
          alt=""
          aria-hidden
          style={{ width: 180, height: 'auto' }}
        />
      </Card>

      {/* HOUSE INFO */}
      <Card style={{ marginTop: 16, padding: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Информация о доме</h2>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Несколько слов, о том что а зачем нам эта информация вообще нужна
          (понять, что дом точно наш, а вот если не наш, то не понятно что
          делать с этим).
        </p>
        <div
          style={{
            marginTop: 20,
            background: 'var(--color-background-surface-subtle)',
            borderRadius: 12,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            Адрес дома
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{meeting.house.address}</div>
          <div
            style={{
              marginTop: 20,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}
          >
            <Metric label="Общая площадь" value={`${meeting.house.totalArea} м²`} />
            <Metric label="Жилые помещения" value={meeting.house.apartmentsCount.toString()} />
            <Metric label="Количество этажей" value={meeting.house.floorsCount.toString()} />
            <Metric label="Количество подъездов" value={'6'} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={notImplemented}
              style={{ color: 'var(--color-action-primary)', fontWeight: 500, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              Подробнее о доме
            </button>
          </div>
        </div>
      </Card>

      {/* PREPARATION ACCORDIONS */}
      <h2 style={{ margin: '24px 0 12px', fontSize: 22, fontWeight: 600 }}>
        Подготовка к общему собранию
      </h2>
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Несколько слов о том, что нужно подготовить и кто может запустить онлайн-собрание.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Accordion
          variant="numbered"
          number={1}
          title="Оценка возможности провести собрание в электронном виде"
          defaultOpen
        >
          <PreparationBlock1 />
        </Accordion>
        <Accordion
          variant="numbered"
          number={2}
          title="Выбор предложений об изменении дома и обсуждении в домовом чате"
          disabled
          onDisabledClick={notImplemented}
        />
        <Accordion
          variant="numbered"
          number={3}
          title="Коллективное обращение в УО о проведении собрания"
          disabled
          onDisabledClick={notImplemented}
        />
      </div>

      {/* PROVEDENIE — 5 inactive accordions */}
      <h2 style={{ margin: '32px 0 12px', fontSize: 22, fontWeight: 600 }}>
        Проведение общего собрания
      </h2>
      <p style={{ margin: '0 0 16px', color: 'var(--color-text-secondary)', fontSize: 14 }}>
        Несколько слов о том, что проводить собрание может только администратор —
        и если вы не он, то станьте им.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          'Подготовка данных по дому',
          'Подготовка повестки',
          'Уведомление о начале собрания через Госуслуги',
          'Начало голосования и сбор голосов',
          'Подведение итогов',
        ].map((title, i) => (
          <Accordion
            key={title}
            variant="numbered"
            number={i + 1}
            title={title}
            disabled
            onDisabledClick={notImplemented}
          />
        ))}
      </div>

      <HistorySection />
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
        {label}
      </div>
      <div className="num-mono" style={{ fontSize: 22, fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

function PreparationBlock1() {
  const { meeting } = useMeetingStore();
  const dataReady: StatusRowItemMini[] = [
    {
      tone: 'success',
      rating: 'хорошая оценка',
      text: 'Кадастровые номера связаны с помещениями в ГИС ЖКХ',
      counter: '116 из 120',
      sub: 'помещений',
      updatedAt: '18.03.2000',
    },
    {
      tone: 'success',
      rating: 'хорошая оценка',
      text: 'Разница между общей площадью дома и суммой площадей помещений',
      counter: '19.7',
      sub: 'м²',
      updatedAt: '09.04.2022',
    },
  ];
  const digitalPotential: StatusRowItemMini[] = [
    {
      tone: 'success',
      rating: 'высокая оценка',
      text: 'Собственники помещений дома получают уведомления на Госуслугах',
      counter: '274 из 360',
      sub: 'собственника',
      hasInlineLink: true,
    },
    {
      tone: 'error',
      rating: 'низкая оценка',
      text: 'Собственники помещений дома проголосуют в мобильном приложении «Госуслуги.Дом»',
      counter: '98 из 360',
      sub: 'собственника',
      hasInlineLink: true,
    },
    {
      tone: 'error',
      rating: 'низкая оценка',
      text: 'Доля помещений не принадлежащих физлицам',
      counter: '23 из 120',
      sub: 'помещений',
      hasInlineLink: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Sub-card: Администратор */}
      <SubCard>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          Администратор электронного собрания
        </div>
        <Pill tone="info">выбран по заявке</Pill>
        <div style={{ marginTop: 12, fontSize: 14 }}>{meeting.administrator.organizationName}</div>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="24-actions-mail" size={16} style={{ color: 'var(--color-action-primary)' }} />
            {meeting.administrator.email}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="24-actions-call" size={16} style={{ color: 'var(--color-action-primary)' }} />
            {meeting.administrator.phone}
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={notImplemented} style={{ color: 'var(--color-action-primary)', fontSize: 14, fontWeight: 500 }}>
            Подробнее об администраторе ОСС
          </button>
        </div>
      </SubCard>

      {/* Sub-card: Готовность данных по дому */}
      <SubCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Готовность данных по дому</span>
          <Pill tone="success">готово</Pill>
        </div>
        {dataReady.map((row, i) => (
          <StatusRowMini key={i} {...row} />
        ))}
      </SubCard>

      {/* Sub-card: Цифровой потенциал */}
      <SubCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Цифровой потенциал</span>
          <Pill tone="error">низкий</Pill>
        </div>
        {digitalPotential.map((row, i) => (
          <StatusRowMini key={i} {...row} />
        ))}
      </SubCard>
    </div>
  );
}

function SubCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-background-surface-subtle)',
        borderRadius: 12,
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

interface StatusRowItemMini {
  tone: 'success' | 'warning' | 'error';
  rating: string;
  text: string;
  counter: string;
  sub: string;
  /** Footnote under text: «данные обновлены DD.MM.YYYY» */
  updatedAt?: string;
  /** Show inline link «Подробнее» under text (per-metric, used in Цифровой потенциал). */
  hasInlineLink?: boolean;
}

function StatusRowMini({
  tone,
  rating,
  text,
  counter,
  sub,
  updatedAt,
  hasInlineLink,
}: StatusRowItemMini) {
  const iconColor =
    tone === 'success'
      ? 'var(--color-success-500)'
      : tone === 'warning'
        ? 'var(--color-warning-600)'
        : 'var(--color-error-500)';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 12,
        padding: '12px 0',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      <span style={{ color: iconColor, paddingTop: 2 }}>
        <Icon name={tone === 'success' ? '24-status-ok' : '24-status-error'} size={20} />
      </span>
      <div>
        <Pill tone={tone}>{rating}</Pill>
        <div style={{ marginTop: 6, fontSize: 14, lineHeight: '20px' }}>{text}</div>
        {updatedAt && (
          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            данные обновлены {updatedAt}
          </div>
        )}
        {hasInlineLink && (
          <button
            type="button"
            onClick={notImplemented}
            className="link-hover"
            style={{
              marginTop: 6,
              color: 'var(--color-action-primary)',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Подробнее
          </button>
        )}
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="num-mono" style={{ fontSize: 16, fontWeight: 600 }}>
          {counter}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{sub}</div>
      </div>
    </div>
  );
}

function HistorySection() {
  const [filter, setFilter] = useState('all');
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>История ОСС по дому</h2>
        <div style={{ minWidth: 180 }}>
          <Select
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'помещения' },
              { value: 'past', label: 'прошедшие' },
              { value: 'active', label: 'активные' },
            ]}
          />
        </div>
      </div>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ fontWeight: 500, padding: '8px 0' }}>тип собрания</th>
              <th style={{ fontWeight: 500, padding: '8px 0' }}>инициатор</th>
              <th style={{ fontWeight: 500, padding: '8px 0' }}>дата собрания</th>
              <th style={{ fontWeight: 500, padding: '8px 0' }}>статус</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                type: 'Заочное собрание',
                initiator: 'ООО «Уют и комфорт»',
                date: '05.03.2023 – 31.03.2023',
                pill: { tone: 'success' as const, text: 'Активно' },
              },
              {
                type: 'Очно-заочное собрание',
                initiator: 'ООО «Уют и комфорт»',
                date: '05.03.2023 – 31.03.2023',
                pill: { tone: 'neutral' as const, text: 'Решение принято' },
              },
            ].map((row, i) => (
              <tr
                key={i}
                onClick={notImplemented}
                style={{
                  borderTop: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '12px 0' }}>{row.type}</td>
                <td style={{ padding: '12px 0' }}>{row.initiator}</td>
                <td className="num-mono" style={{ padding: '12px 0' }}>{row.date}</td>
                <td style={{ padding: '12px 0' }}>
                  <Pill tone={row.pill.tone}>{row.pill.text}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
