export const clamp = (value, min = 0, max = 100) => {
  return Math.min(Math.max(value, min), max);
};

export const inverseScore = (value, maxValue) => {
  if (maxValue <= 0) {
    return 100;
  }

  return clamp(100 - (value / maxValue) * 100);
};

export const getHealthStatus = (score) => {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 75) {
    return "Healthy";
  }

  if (score >= 60) {
    return "Needs Attention";
  }

  if (score >= 40) {
    return "At Risk";
  }

  return "Poor";
};