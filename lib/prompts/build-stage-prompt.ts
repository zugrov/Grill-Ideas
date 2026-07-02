import { STAGE_0_PROMPT } from "./stages/0";
import { STAGE_1_PROMPT } from "./stages/1";
import { STAGE_2_PROMPT } from "./stages/2";
import { STAGE_3_PROMPT } from "./stages/3";
import { STAGE_4_PROMPT } from "./stages/4";
import { STAGE_5_PROMPT } from "./stages/5";
import { STAGE_6_PROMPT } from "./stages/6";
import { STAGE_7_PROMPT } from "./stages/7";
import { STAGE_8_PROMPT } from "./stages/8";
import { STAGE_9_PROMPT } from "./stages/9";
import { STAGE_10_PROMPT } from "./stages/10";
import { STAGE_11_PROMPT } from "./stages/11";
import { STAGE_12_PROMPT } from "./stages/12";
import { STAGE_13_PROMPT } from "./stages/13";
import { STAGE_14_PROMPT } from "./stages/14";
import { BASE_PROMPT } from "./base";

const STAGE_PROMPTS: Record<number, string> = {
  0: STAGE_0_PROMPT,
  1: STAGE_1_PROMPT,
  2: STAGE_2_PROMPT,
  3: STAGE_3_PROMPT,
  4: STAGE_4_PROMPT,
  5: STAGE_5_PROMPT,
  6: STAGE_6_PROMPT,
  7: STAGE_7_PROMPT,
  8: STAGE_8_PROMPT,
  9: STAGE_9_PROMPT,
  10: STAGE_10_PROMPT,
  11: STAGE_11_PROMPT,
  12: STAGE_12_PROMPT,
  13: STAGE_13_PROMPT,
  14: STAGE_14_PROMPT,
};

export function buildStageSystemPrompt(stage: number): string {
  const stagePrompt = STAGE_PROMPTS[stage];
  if (!stagePrompt) {
    throw new Error(`Unknown stage: ${stage}`);
  }
  return `${BASE_PROMPT}\n\n${stagePrompt}`;
}
