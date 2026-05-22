import React from 'react';
import { useNavigate } from 'react-router-dom';

import { PageShell } from '../components/layout/PageShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { STEPPER_LABELS } from '../components/layout/Stepper';
import { useMeetingStore } from '../lib/store';

export function Module2Placeholder() {
  const navigate = useNavigate();
  const { meeting } = useMeetingStore();

  const steps = STEPPER_LABELS.map((label, i) => {
    if (i === 0) return { label, state: 'completed' as const };
    if (i === 1) return { label, state: 'active' as const };
    return { label, state: 'pending' as const };
  });

  return (
    <PageShell address={meeting.house.address} showStepper steps={steps}>
      <div style={{ marginTop: 8 }}>
        <BackLink onClick={() => navigate('/oss/new/house-b')} />
      </div>
      <Card style={{ marginTop: 24, padding: 40, textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Формирование повестки</h1>
        <p style={{ margin: '12px 0 24px', color: 'var(--color-text-secondary)' }}>
          Модуль 2 будет добавлен в следующих итерациях прототипа.
        </p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          На дашборд
        </Button>
      </Card>
    </PageShell>
  );
}
