#!/usr/bin/env node
/**
 * Smoke E2E in browser: register → form → stage 0 stream start → payment gate after stage 1
 * Usage: node scripts/e2e-browse.mjs
 * Requires: npm run dev on :3000, npx playwright install chromium
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const STREAM_TIMEOUT_MS = Number(process.env.E2E_STREAM_TIMEOUT_MS ?? 600000);
const EMAIL = `browse-e2e-${Date.now()}@example.com`;
const PASSWORD = "GrillTest123!";

const FORM = {
  "Название идеи": "Browse Test SaaS",
  "Краткое описание": "Smoke test via Playwright browser",
  "Продукт / услуга": "Software",
  "Для кого": "SMB",
  "География": "RU",
  "Стадия проекта": "Идея",
  "Есть ли MVP": "Нет",
  "Есть ли продажи": "Нет",
  "Модель монетизации": "Подписка",
  "Средний чек": "5000",
  "Каналы привлечения": "Контент",
  "Команда": "Solo founder",
  "Бюджет": "500k",
  "Горизонт планирования": "12 мес",
  "Ограничения": "Время",
  "Цель анализа": "Спрос",
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  try {
    console.log("1. Register");
    await page.goto(`${BASE}/register`);
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.check('input[type="checkbox"]');
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard/analyze**", { timeout: 15000 });
    console.log("   OK redirect to analyze");

    console.log("2. Fill form");
    for (const [label, value] of Object.entries(FORM)) {
      const input = page.locator(`label:has-text("${label}")`).locator("..").locator("input");
      await input.fill(value);
    }
    await page.click('button:has-text("Запустить анализ")');
    console.log("   OK form submitted");

    console.log(`3. Stage 0 streaming (up to ${STREAM_TIMEOUT_MS / 1000}s)`);
    await page.waitForSelector('text=Генерация...', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('button:has-text("Продолжить")', {
      timeout: STREAM_TIMEOUT_MS,
    });
    console.log("   OK stage 0 done");

    console.log("4. Stage 0 reply");
    await page.waitForSelector("text=до 5 уточнений", { timeout: 10000 });
    await page.fill(
      "textarea",
      "У нас уже есть данные по конкурентам и готовность платить подтверждена интервью.",
    );
    await page.click('button:has-text("Отправить уточнение")');
    await page.waitForSelector("text=Вы", { timeout: STREAM_TIMEOUT_MS });
    await page.waitForSelector('button:has-text("Продолжить")', {
      timeout: STREAM_TIMEOUT_MS,
    });
    console.log("   OK reply on stage 0");

    console.log("5. Stage 1");
    await page.click('button:has-text("Продолжить → следующий этап")');
    await page.waitForSelector('text=Генерация...', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('button:has-text("Продолжить")', {
      timeout: STREAM_TIMEOUT_MS,
    }).catch(() => {});
    const paymentVisible = await page
      .locator('text=999')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const continueBtn = await page
      .locator('button:has-text("Продолжить")')
      .isVisible()
      .catch(() => false);

    if (paymentVisible) {
      console.log("   OK payment gate visible");
    } else if (continueBtn) {
      await page.click('button:has-text("Продолжить")');
      await page.waitForSelector('text=999', { timeout: STREAM_TIMEOUT_MS });
      console.log("   OK payment gate after stage 1 continue");
    } else {
      errors.push("Payment gate not found");
    }

    console.log("6. Resume check");
    await page.goto(`${BASE}/dashboard/analyze`);
    const hasChat = await page
      .locator('text=Этап')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const hasPay = await page.locator('text=999').isVisible({ timeout: 3000 }).catch(() => false);
    if (hasChat || hasPay) {
      console.log("   OK resume works");
    } else {
      errors.push("Resume failed");
    }

    if (errors.length) {
      console.error("FAIL:", errors.join("; "));
      process.exit(1);
    }
    console.log("\nBrowse E2E passed. User:", EMAIL, PASSWORD);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
