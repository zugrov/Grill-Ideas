export type AnalysisStatus =
  | "draft"
  | "free_in_progress"
  | "awaiting_payment"
  | "paid_in_progress"
  | "completed";

export type PaymentStatus = "pending" | "succeeded" | "canceled";

export type MessageRole = "user" | "assistant" | "system";

export interface ProjectInputData {
  name: string;
  description: string;
  product: string;
  target: string;
  geography: string;
  stage: string;
  mvp: string;
  sales: string;
  model: string;
  check: string;
  channels: string;
  team: string;
  budget: string;
  horizon: string;
  constraints: string;
  goal: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  status: AnalysisStatus;
  current_stage: number;
  input_data: ProjectInputData | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface AnalysisMessage {
  id: string;
  analysis_id: string;
  stage: number;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  analysis_id: string;
  yookassa_id: string;
  status: PaymentStatus;
  amount: number;
  created_at: string;
}
