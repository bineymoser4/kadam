// Scoring v2 — every weight lives here, not inline in a component, so a weight
// change is a one-line diff and golden tests catch accidental drift.
export const SCORING_VERSION = "v2";

export const WEIGHTS = {
  academic: 0.28,
  english: 0.14,
  finance: 0.18,
  major: 0.15,
  deadline: 0.06,
  destination: 0.04,
} as const;

export const ACADEMIC_SUBWEIGHTS = {
  gpa: 0.48,
  sat: 0.3,
  ielts: 0.22,
} as const;

export const LEVEL_THRESHOLDS = {
  high: 78,
  medium: 58,
};

export const STATUS_THRESHOLDS = {
  strong: 82,
  ok: 64,
};

// Confidence band by how many of the 6 top-level factors could not be scored
// (missing student input or missing university target — never a guessed constant).
export const CONFIDENCE_BANDS = {
  high: 0,
  medium: 2,
};

// Score range shown around the point estimate, widening as confidence drops.
export const RANGE_MARGIN = {
  "высокая": 3,
  "средняя": 6,
  "низкая": 10,
};
