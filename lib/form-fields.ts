import type { ProjectInputData } from "@/lib/types";

export const FORM_FIELDS: {
  key: keyof ProjectInputData;
  label: string;
  placeholder: string;
}[] = [
  { key: "name", label: "Название идеи", placeholder: "SaaS для управления запасами" },
  { key: "description", label: "Краткое описание", placeholder: "2–3 предложения о сути" },
  { key: "product", label: "Продукт / услуга", placeholder: "Что продаётся" },
  { key: "target", label: "Для кого", placeholder: "Целевая аудитория" },
  { key: "geography", label: "География", placeholder: "Россия / СНГ / глобально" },
  { key: "stage", label: "Стадия проекта", placeholder: "Идея / MVP / есть продажи" },
  { key: "mvp", label: "Есть ли MVP", placeholder: "Да / Нет / В разработке" },
  { key: "sales", label: "Есть ли продажи", placeholder: "Объём, клиенты" },
  { key: "model", label: "Модель монетизации", placeholder: "Подписка / разовая / %" },
  { key: "check", label: "Средний чек", placeholder: "В рублях" },
  { key: "channels", label: "Каналы привлечения", placeholder: "Как привлекаете клиентов" },
  { key: "team", label: "Команда", placeholder: "Кто и что делает" },
  { key: "budget", label: "Бюджет", placeholder: "Сколько готовы вложить" },
  { key: "horizon", label: "Горизонт планирования", placeholder: "3 / 6 / 12 / 24 месяца" },
  { key: "constraints", label: "Ограничения", placeholder: "Время, ресурсы, регуляторика" },
  { key: "goal", label: "Цель анализа", placeholder: "Что важнее всего проверить" },
];

export function formatProjectInput(data: ProjectInputData): string {
  const lines = FORM_FIELDS.map(
    (f) => `- ${f.label}: ${data[f.key]?.trim() || "не указано"}`,
  );
  return `ДАННЫЕ ПРОЕКТА:\n${lines.join("\n")}`;
}

export const STAGE_TITLES: Record<number, string> = {
  0: "Нормализация входных данных",
  1: "Первичный скрининг идеи",
  2: "Клиент, сегменты, JTBD",
  3: "Рынок и реальная достижимость",
  4: "Конкуренты и замещающие решения",
  5: "Бизнес-модель и монетизация",
  6: "GTM, маркетинг и продажи",
  7: "Операционная модель",
  8: "MVP и продуктовая логика",
  9: "Команда и оргмодель",
  10: "Финансовая модель",
  11: "Юнит-экономика",
  12: "Риски и точки разрушения",
  13: "План валидации",
  14: "Итоговый бизнес-план",
};
