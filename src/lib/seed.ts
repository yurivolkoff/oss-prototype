import type { House, Administrator, Premise, PremiseOwner } from './types';

export const seedHouse: House = {
  address: 'г. Санкт-Петербург, ул. Пушкина, д. 1',
  cadastralNumber: '78:23:0000000:1234',
  addressCode: '78000-00-00-001-000-001',
  totalArea: 4419.7,
  apartmentsCount: 120,
  nonResidentialCount: 5,
  floorsCount: 5,
  dataUpdatedAt: '2022-04-09',
  cadastralLinkedCount: 116,
  duplicatesCount: 98,
};

export const seedAdministrator: Administrator = {
  organizationName: 'ООО Уют и комфорт',
  email: 'info@uyut.ru',
  phone: '+7 812 555-50-50',
  inn: '7812345678',
};

const owner = (
  fullName: string,
  email: string,
  phone: string,
  area: number,
  share: string,
  doc: string,
  state: 'verified' | 'pending' = 'verified'
): PremiseOwner => ({
  fullName,
  email,
  phone,
  ownedArea: area,
  ownershipShare: share,
  ownershipDocNumber: doc,
  state,
});

// Apartments per entrance distribution: 6 entrances × 5 floors × 4 apartments = 120
function buildApartments(): Premise[] {
  const list: Premise[] = [];
  // Areas mirror the visible Figma reference (40–80 m² mix).
  const areaPool = [38.4, 42.7, 45.1, 48.0, 52.3, 55.7, 62.5, 71.2, 78.9, 80.4];

  // Pre-seeded problem premises (to land in specific cells).
  // Key = `${entrance}-${floor}-${slot}` slot in 1..4
  const problems: Record<string, { status: 'warning' | 'error'; issues: ('no_cadastral' | 'wrong_area' | 'duplicate')[]; note?: string }> = {
    // Подъезд 1
    '1-2-3': { status: 'error', issues: ['no_cadastral'], note: 'кадастровый номер не связан с помещением' },
    '1-4-1': { status: 'error', issues: ['duplicate'], note: 'дублирующий кадастровый номер' },
    '1-5-2': { status: 'warning', issues: ['wrong_area'], note: '+1 м² к данным Росреестра' },
    // Подъезд 2
    '2-1-2': { status: 'error', issues: ['no_cadastral'], note: 'кадастровый номер не связан с помещением' },
    '2-3-4': { status: 'error', issues: ['duplicate'], note: 'дублирующий кадастровый номер' },
    '2-5-1': { status: 'warning', issues: ['wrong_area'], note: '+0.4 м² к данным Росреестра' },
    // Подъезд 3
    '3-2-1': { status: 'error', issues: ['no_cadastral'], note: 'кадастровый номер не связан с помещением' },
    '3-3-3': { status: 'error', issues: ['duplicate'], note: 'дублирующий кадастровый номер' },
    // Подъезд 4
    '4-1-4': { status: 'error', issues: ['duplicate'], note: 'дублирующий кадастровый номер' },
    '4-4-2': { status: 'warning', issues: ['wrong_area'], note: '+0.8 м² к данным Росреестра' },
    // Подъезд 5
    '5-3-1': { status: 'error', issues: ['no_cadastral'], note: 'кадастровый номер не связан с помещением' },
    '5-5-4': { status: 'error', issues: ['duplicate'], note: 'дублирующий кадастровый номер' },
    // Подъезд 6 — включает Кв. №15 на этаже 4, slot 2 (см. ниже)
    // Issue both: no_cadastral + wrong_area — Figma shows both errors in modal for Кв.№15.
    '6-4-2': { status: 'error', issues: ['no_cadastral', 'wrong_area'], note: 'кадастровый номер не связан с помещением' },
  };

  let counter = 1;
  for (let entrance = 1; entrance <= 6; entrance++) {
    for (let floor = 1; floor <= 5; floor++) {
      for (let slot = 1; slot <= 4; slot++) {
        const number = String(counter);
        const area = areaPool[counter % areaPool.length];
        const key = `${entrance}-${floor}-${slot}`;
        const problem = problems[key];

        // Force apartment №15 to land at entrance 6, floor 4, slot 2 via a renumber.
        // Easier path: when we hit entrance=6, floor=4, slot=2, force number = '15'.
        const isForced15 = entrance === 6 && floor === 4 && slot === 2;
        const apartmentNumber = isForced15 ? '15' : number;

        const owners: PremiseOwner[] = isForced15
          ? [
              owner('Иванов Сергей Александрович', 'ivanov.s@example.ru', '+7 921 111-22-33', area / 2, '1/2', '78-78-001/001/2020-1234', 'verified'),
              owner('Иванова Мария Сергеевна', 'ivanova.m@example.ru', '+7 921 444-55-66', area / 2, '1/2', '78-78-001/001/2020-1235', 'pending'),
              owner('Иванов Артём Сергеевич', '', '', 0, '0', '—', 'pending'),
            ]
          : [
              owner(
                `Собственник №${counter}`,
                `owner${counter}@example.ru`,
                `+7 921 ${String(100 + counter).padStart(3, '0')}-00-00`,
                area,
                '1',
                `78-78-001/001/2020-${String(1000 + counter).padStart(4, '0')}`,
                'verified'
              ),
            ];

        list.push({
          id: `apt-${apartmentNumber}-${entrance}-${floor}-${slot}`,
          type: 'apartment',
          number: apartmentNumber,
          entrance,
          floor,
          area,
          cadastralNumber: problem?.issues.includes('no_cadastral')
            ? ''
            : `78:23:0000000:${1000 + counter}`,
          cadastralLinked: !problem?.issues.includes('no_cadastral'),
          status: (problem?.status ?? 'ok') as Premise['status'],
          issues: (problem?.issues ?? []) as Premise['issues'],
          owners,
          warningNote: problem?.note,
        });
        counter++;
      }
    }
  }
  return list;
}

function buildNonResidential(): Premise[] {
  return [
    {
      id: 'nr-parking',
      type: 'non_residential',
      number: 'Парковка',
      entrance: 0,
      floor: -1,
      area: 5000,
      cadastralNumber: '78:23:0000000:9876',
      cadastralLinked: true,
      status: 'ok',
      issues: [],
      owners: [owner('ООО «Стоянка-Сервис»', 'info@parking.ru', '+7 812 222-22-22', 5000, '1', '78-78-001/001/2018-9876')],
    },
    {
      id: 'nr-shop',
      type: 'non_residential',
      number: 'Магазин 1',
      entrance: 1,
      floor: 1,
      area: 145.2,
      cadastralNumber: '78:23:0000000:9877',
      cadastralLinked: true,
      status: 'ok',
      issues: [],
      owners: [owner('ИП Сидоров А.А.', 'sidorov@example.ru', '+7 921 777-88-99', 145.2, '1', '78-78-001/001/2019-1010')],
    },
    {
      id: 'nr-office',
      type: 'non_residential',
      number: 'Офис 2',
      entrance: 2,
      floor: 1,
      area: 80.0,
      cadastralNumber: '78:23:0000000:9878',
      cadastralLinked: true,
      status: 'ok',
      issues: [],
      owners: [owner('ООО «Бухгалтер-Сервис»', 'office@example.ru', '+7 812 333-33-33', 80.0, '1', '78-78-001/001/2019-1011')],
    },
    {
      id: 'nr-storage',
      type: 'non_residential',
      number: 'Кладовая 3',
      entrance: 3,
      floor: -1,
      area: 22.5,
      cadastralNumber: '',
      cadastralLinked: false,
      status: 'error',
      issues: ['no_cadastral'],
      owners: [owner('ООО «Хранение+»', 'storage@example.ru', '+7 921 555-66-77', 22.5, '1', '78-78-001/001/2020-2020')],
      warningNote: 'кадастровый номер не связан',
    },
    {
      id: 'nr-pharmacy',
      type: 'non_residential',
      number: 'Аптека',
      entrance: 1,
      floor: 1,
      area: 60.0,
      cadastralNumber: '78:23:0000000:9879',
      cadastralLinked: true,
      status: 'ok',
      issues: [],
      owners: [owner('Аптеки «Здоровье»', 'aptek@example.ru', '+7 812 444-44-44', 60.0, '1', '78-78-001/001/2019-1012')],
    },
  ];
}

export const seedPremises: Premise[] = [...buildApartments(), ...buildNonResidential()];
