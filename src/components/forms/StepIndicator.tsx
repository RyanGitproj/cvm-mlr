import { cn } from "@/lib/cn";

type Props = {
  current: number;
  total: number;
  label: string;
};

/**
 * Progress bar segmentée (un segment par étape), aux couleurs du thème —
 * disposition reprise des visuels du funnel MLR.
 */
export function StepIndicator({ current, total, label }: Props) {
  return (
    <div>
      <p className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium text-ink-strong">{label}</span>
        <span className="text-ink-soft">
          Étape {current} sur {total}
        </span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Étape ${current} sur ${total}`}
        className="mt-2 flex gap-1.5"
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              index < current ? "bg-accent" : "bg-line",
            )}
          />
        ))}
      </div>
    </div>
  );
}
