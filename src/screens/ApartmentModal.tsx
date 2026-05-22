import React, { useEffect, useMemo, useState } from 'react';

import { Modal } from '../components/ui/Modal';
import { TextInput } from '../components/ui/TextInput';
import { Textarea } from '../components/ui/Textarea';
import { TabBar } from '../components/ui/TabBar';
import { Button } from '../components/ui/Button';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateShare,
} from '../lib/validators';
import { useToastStore } from '../lib/toast';

import type { Premise, PremiseOwner } from '../lib/types';

export interface ApartmentModalProps {
  premise: Premise | null;
  onClose: () => void;
}

type Errors = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  share?: string | null;
};

export function ApartmentModal({ premise, onClose }: ApartmentModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [ownerData, setOwnerData] = useState<PremiseOwner | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (premise) {
      setActiveTab(0);
      setOwnerData(premise.owners[0] ?? null);
      setErrors({});
      setComment('');
    }
  }, [premise]);

  // When tab changes — reload owner snapshot from premise
  useEffect(() => {
    if (!premise) return;
    const next = premise.owners[activeTab] ?? null;
    setOwnerData(next);
    setErrors({});
  }, [activeTab, premise]);

  const tabs = useMemo(
    () =>
      (premise?.owners ?? []).map((o, i) => ({
        key: String(i),
        label: `Собственник ${i + 1}`,
        state: o.state,
      })),
    [premise]
  );

  if (!premise) return null;

  // Same wording as ApartmentTile tooltip → consistency.
  const cadastralError = premise.issues.includes('no_cadastral')
    ? premise.issues.includes('duplicate')
      ? 'Дублирующий кадастровый номер'
      : 'Нет кадастрового номера'
    : null;
  const areaError = premise.issues.includes('wrong_area')
    ? 'Проверьте площадь квартиры'
    : null;

  const setOwnerField = <K extends keyof PremiseOwner>(field: K, v: PremiseOwner[K]) => {
    setOwnerData((prev) => (prev ? { ...prev, [field]: v } : prev));
  };

  const validateField = (field: keyof Errors, val: string) => {
    let msg: string | null = null;
    if (field === 'fullName') msg = validateRequired(val);
    else if (field === 'email') msg = val.trim() ? validateEmail(val) : null;
    else if (field === 'phone') msg = val.trim() ? validatePhone(val) : null;
    else if (field === 'share') msg = val.trim() ? validateShare(val) : null;
    setErrors((e) => ({ ...e, [field]: msg }));
  };

  const handleSave = () => {
    // re-run all validators on save
    const next: Errors = {
      fullName: validateRequired(ownerData?.fullName ?? ''),
      email: ownerData?.email ? validateEmail(ownerData.email) : null,
      phone: ownerData?.phone ? validatePhone(ownerData.phone) : null,
      share: ownerData?.ownershipShare ? validateShare(ownerData.ownershipShare) : null,
    };
    setErrors(next);
    const hasError = Object.values(next).some(Boolean);
    if (hasError) {
      useToastStore.getState().show('Проверьте отмеченные поля');
      return;
    }
    // Note (per spec): данные не персистятся в meeting.premises
    useToastStore.getState().show('Сохранено');
    onClose();
  };

  return (
    <Modal
      open={Boolean(premise)}
      onClose={onClose}
      title={`Квартира №${premise.number}`}
      subtitle={`Подъезд ${premise.entrance}, этаж ${premise.floor}`}
      width={680}
      footer={
        <Button variant="primary" onClick={handleSave}>
          Сохранить
        </Button>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <TextInput
          label="кадастровый номер"
          defaultValue={premise.cadastralNumber}
          error={cadastralError}
        />
        <TextInput
          label="площадь помещения, м²"
          defaultValue={String(premise.area)}
          error={areaError}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <TabBar
          tabs={tabs}
          activeKey={String(activeTab)}
          onChange={(k) => setActiveTab(Number(k))}
        />
      </div>

      {ownerData && (
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <TextInput
              label="Ф.И.О."
              value={ownerData.fullName}
              onChange={(e) => setOwnerField('fullName', e.target.value)}
              onBlur={(e) => validateField('fullName', e.target.value)}
              error={errors.fullName}
            />
          </div>
          <TextInput
            label="Email"
            value={ownerData.email}
            onChange={(e) => setOwnerField('email', e.target.value)}
            onBlur={(e) => validateField('email', e.target.value)}
            error={errors.email}
          />
          <TextInput
            label="Телефон"
            value={ownerData.phone}
            onChange={(e) => setOwnerField('phone', e.target.value)}
            onBlur={(e) => validateField('phone', e.target.value)}
            error={errors.phone}
          />
          <TextInput
            label="Площадь в собственности, м²"
            value={String(ownerData.ownedArea)}
            onChange={(e) =>
              setOwnerField('ownedArea', Number(e.target.value.replace(',', '.')) || 0)
            }
          />
          <TextInput
            label="Доля в праве"
            value={ownerData.ownershipShare}
            onChange={(e) => setOwnerField('ownershipShare', e.target.value)}
            onBlur={(e) => validateField('share', e.target.value)}
            error={errors.share}
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <TextInput
              label="Номер права собственности"
              value={ownerData.ownershipDocNumber}
              onChange={(e) => setOwnerField('ownershipDocNumber', e.target.value)}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Textarea
          label="Комментарий"
          value={comment}
          onValueChange={setComment}
          maxLength={3000}
          placeholder="Например: уточнить данные у собственника после ремонта квартиры — площадь могла измениться."
        />
      </div>
    </Modal>
  );
}
