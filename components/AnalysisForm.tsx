"use client";

import { useState } from "react";
import { FORM_FIELDS } from "@/lib/form-fields";
import type { ProjectInputData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AnalysisFormProps = {
  onSubmit: (data: ProjectInputData) => void;
  loading?: boolean;
};

const emptyForm = (): ProjectInputData => ({
  name: "",
  description: "",
  product: "",
  target: "",
  geography: "",
  stage: "",
  mvp: "",
  sales: "",
  model: "",
  check: "",
  channels: "",
  team: "",
  budget: "",
  horizon: "",
  constraints: "",
  goal: "",
});

export function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [form, setForm] = useState<ProjectInputData>(emptyForm);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-1">Данные вашей идеи</h2>
      <p className="text-sm text-mc-text-second mb-6">
        Чем точнее данные — тем жёстче и полезнее анализ
      </p>
      {FORM_FIELDS.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          <Input
            placeholder={field.placeholder}
            value={form[field.key]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
          />
        </div>
      ))}
      <Button
        type="button"
        disabled={loading}
        className="w-full"
        onClick={() => onSubmit(form)}
      >
        {loading ? "Сохранение..." : "Запустить GRILL — этап 0"}
      </Button>
    </div>
  );
}
