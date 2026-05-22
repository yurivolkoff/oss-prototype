/**
 * End-to-end smoke test for module 1.
 * Verifies the business-logic checklist (§ 5 of spec/01-preparation.md).
 *
 * Usage:
 *   node tests/e2e.mjs            (assumes dev server on :5173)
 *   BASE_URL=http://localhost:4173 node tests/e2e.mjs
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const OUT = resolve('test-output');
mkdirSync(OUT, { recursive: true });

const results = [];
let failures = 0;

function record(name, ok, note = '') {
  results.push({ name, ok, note });
  if (!ok) failures++;
  const marker = ok ? '✓' : '✗';
  console.log(`${marker} ${name}${note ? ` — ${note}` : ''}`);
}

async function expect(cond, name, note = '') {
  record(name, !!cond, note);
}

async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 900, height: 1000 },
    locale: 'ru-RU',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  // ─── 1. Dashboard renders ───────────────────────────────────────────────
  await page.goto(BASE_URL + '/');
  await page.waitForLoadState('networkidle');
  await shot(page, '01-dashboard');

  await expect(
    await page.getByRole('heading', { name: /Общее собрание собственников/ }).isVisible(),
    '01.1 — Hero H1 виден'
  );
  await expect(
    await page.getByRole('button', { name: 'Начать собрание' }).isVisible(),
    '01.2 — CTA «Начать собрание»'
  );
  await expect(
    await page.getByRole('heading', { name: 'Информация о доме' }).isVisible(),
    '01.3 — Карточка «Информация о доме»'
  );
  await expect(
    await page.getByText('4419.7 м²').isVisible(),
    '01.4 — Метрика площади 4419.7 м²'
  );
  await expect(
    await page.getByText('Оценка возможности провести собрание в электронном виде').isVisible(),
    '01.5 — Блок 1 «Подготовка» рендерится'
  );
  await expect(
    await page.getByText('Готовность данных по дому').isVisible(),
    '01.6 — Подблок «Готовность данных по дому» (блок 1 раскрыт)'
  );
  await expect(
    await page.getByText('Цифровой потенциал').isVisible(),
    '01.7 — Подблок «Цифровой потенциал»'
  );
  await expect(
    await page.getByText('История ОСС по дому').isVisible(),
    '01.8 — История ОСС по дому'
  );

  // toast on inactive accordion
  await page.getByText('Выбор предложений об изменении дома и обсуждении в домовом чате').click();
  await page.waitForTimeout(200);
  await expect(
    await page.getByText('Доступно в продакшене').first().isVisible(),
    '01.9 — Toast «Доступно в продакшене» при клике на блок 2'
  );
  await page.waitForTimeout(3300);

  // ─── 2. Start meeting ───────────────────────────────────────────────────
  await page.getByRole('button', { name: 'Начать собрание' }).click();
  await page.waitForURL(/\/oss\/new\/house-a/);
  await shot(page, '02-prep-house-a');

  await expect(
    page.url().includes('/oss/new/house-a'),
    '02.1 — Переход на экран 02 (/oss/new/house-a)'
  );
  await expect(
    await page.getByRole('heading', { name: 'Подготовка данных по дому 1/2' }).isVisible(),
    '02.2 — H1 экрана 02 виден'
  );
  await expect(
    await page.getByText('Площадь помещений совпадает с реестром').isVisible(),
    '02.3 — Status-row «Площадь помещений совпадает»'
  );
  await expect(
    await page.getByText('данные обновлены 09.04.2022').isVisible(),
    '02.4 — Footnote с датой обновления'
  );

  // Stepper step 1 active
  const stepperActiveText = await page.locator('text=Подготовка данных по дому').first().isVisible();
  await expect(stepperActiveText, '02.5 — Степпер: подпись шага 1 видна');

  // info popover on screen 02
  const infoBtn = page.getByRole('button', { name: 'Подробнее о совпадении площади' });
  await infoBtn.click();
  await page.waitForTimeout(150);
  await expect(
    await page.getByText('Площадь жилых и нежилых помещений в ГИС ЖКХ совпадает').isVisible(),
    '02.6 — Info-popover открывается'
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await expect(
    !(await page.getByText('Площадь жилых и нежилых помещений в ГИС ЖКХ совпадает').isVisible()),
    '02.7 — Info-popover закрывается по Esc'
  );

  // Документы accordion
  await page.getByRole('button', { name: /^Документы/ }).click();
  await page.waitForTimeout(200);
  await expect(
    await page.getByText('Технический паспорт МКД.pdf').isVisible(),
    '02.8 — Аккордеон «Документы» раскрывается'
  );

  // ─── 3. Verno-dalee → 03 ────────────────────────────────────────────────
  await page.getByRole('button', { name: 'Верно, далее' }).click();
  await page.waitForURL(/\/oss\/new\/house-b/);
  await shot(page, '03-prep-house-b');
  await expect(
    page.url().includes('/oss/new/house-b'),
    '03.1 — Переход на экран 03'
  );
  await expect(
    await page.getByRole('heading', { name: 'Подготовка данных по дому 2/2' }).isVisible(),
    '03.2 — H1 экрана 03 виден'
  );
  await expect(
    await page.getByText('Дополнительная информация о доме').isVisible(),
    '03.3 — Карточка «Дополнительная информация»'
  );
  await expect(
    await page.getByText('Шахматка по дому').isVisible(),
    '03.4 — Карточка «Шахматка по дому»'
  );
  await expect(
    await page.getByText('Подъезд 1, этаж 1').isVisible(),
    '03.5 — Группа подъезд/этаж рендерится'
  );

  const tileCount = await page.locator('button:has-text("Кв. №")').count();
  await expect(tileCount >= 100, `03.6 — Плиток квартир рендерится много (есть ${tileCount}, ожидаем ≥100)`);

  await expect(
    await page.getByText('Нежилые помещения').isVisible(),
    '03.7 — Группа нежилых помещений'
  );

  // ─── 4. Filter chip + duplicate jump ─────────────────────────────────────
  await page.getByRole('button', { name: 'дубль', exact: true }).click();
  await page.waitForTimeout(150);
  const afterDup = await page.locator('button:has-text("Кв. №")').count();
  await expect(afterDup < tileCount, `03.8 — Chip «дубль» сужает список (было ${tileCount}, стало ${afterDup})`);
  // снимаем chip
  await page.getByRole('button', { name: 'дубль', exact: true }).click();
  await page.waitForTimeout(150);

  // ─── 5. Click error tile (Кв. №15) — opens modal ────────────────────────
  await page.getByRole('button', { name: /Квартира №15.*есть проблема/ }).click();
  await page.waitForTimeout(300);
  await shot(page, '04-apartment-modal');

  await expect(
    await page.getByRole('heading', { name: 'Квартира №15' }).isVisible(),
    '04.1 — Модалка квартиры открывается'
  );
  await expect(
    await page.getByText('❌ Нет кадастрового номера').isVisible(),
    '04.2 — Helper-text «Нет кадастрового номера»'
  );
  // Tab-bar: 3 tabs
  await expect(
    await page.getByRole('tab', { name: /Собственник 1/ }).isVisible(),
    '04.3 — Tab «Собственник 1»'
  );
  await expect(
    await page.getByRole('tab', { name: /Собственник 2/ }).isVisible(),
    '04.4 — Tab «Собственник 2»'
  );
  // Switch tabs
  await page.getByRole('tab', { name: /Собственник 2/ }).click();
  await page.waitForTimeout(200);
  // After switch, data should reflect Owner 2's name (Иванова Мария Сергеевна)
  const fioInput = page.locator('input').nth(2); // 1st: cadastral, 2nd: area, 3rd: ФИО
  const fioValue = await fioInput.inputValue();
  await expect(
    fioValue.includes('Иванова'),
    `04.5 — Tab-switch меняет данные собственника (Ф.И.О. = «${fioValue}»)`
  );

  // Validate email error on blur
  await page.getByRole('tab', { name: /Собственник 1/ }).click();
  await page.waitForTimeout(150);
  const emailInput = page.locator('input').nth(3);
  await emailInput.fill('invalid');
  await emailInput.blur();
  await page.waitForTimeout(150);
  await expect(
    await page.getByText('Укажите email в формате').isVisible(),
    '04.6 — Валидация email при blur'
  );

  // Esc closes modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(
    !(await page.getByRole('heading', { name: 'Квартира №15' }).isVisible()),
    '04.7 — Esc закрывает модалку'
  );

  // ─── 6. Continue → module 2 placeholder ─────────────────────────────────
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await page.waitForURL(/\/oss\/new\/module-2/);
  await shot(page, '05-module-2-placeholder');
  await expect(
    page.url().includes('/oss/new/module-2'),
    '05.1 — Переход в модуль 2 (заглушка)'
  );
  // step 1 should be completed in stepper — check that the next step label is "Формирование повестки"
  await expect(
    await page.getByRole('heading', { name: 'Формирование повестки' }).isVisible(),
    '05.2 — Заглушка модуля 2 рендерится'
  );

  // ─── Final report ──────────────────────────────────────────────────────
  console.log('\n──────────────────────────');
  console.log(`Passed: ${results.filter((r) => r.ok).length}/${results.length}`);
  if (failures > 0) console.log(`FAILED: ${failures}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) console.log(consoleErrors.slice(0, 10).join('\n'));

  writeFileSync(
    resolve(OUT, 'e2e-results.json'),
    JSON.stringify({ results, consoleErrors }, null, 2),
    'utf-8'
  );

  await browser.close();
  process.exit(failures === 0 && consoleErrors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
