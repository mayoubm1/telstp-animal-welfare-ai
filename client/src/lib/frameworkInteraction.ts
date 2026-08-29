export function toggleFrameworkPrinciple(activePrinciple: string | null, selectedPrinciple: string): string | null {
  return activePrinciple === selectedPrinciple ? null : selectedPrinciple;
}

export const frameworkCardMotionClasses = "motion-safe:transition-[transform,box-shadow,border-color,background-color] motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 motion-reduce:hover:transform-none motion-reduce:focus-visible:transform-none";
