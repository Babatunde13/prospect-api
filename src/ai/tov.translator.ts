export function translateTOV(
  formality: number,
  warmth: number,
  directness: number,
): string {
  const formalityText =
    formality > 0.7 ? 'formal' : formality > 0.4 ? 'semi-formal' : 'casual';
  const warmthText =
    warmth > 0.7
      ? 'warm and friendly'
      : warmth > 0.4
        ? 'neutral warmth'
        : 'minimal warmth';
  const directnessText =
    directness > 0.7
      ? 'direct and concise'
      : directness > 0.4
        ? 'balanced'
        : 'subtle';

  return `Use a ${formalityText} tone, ${warmthText}, and be ${directnessText}.`;
}
