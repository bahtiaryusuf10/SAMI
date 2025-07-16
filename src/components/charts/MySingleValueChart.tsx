import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MySingleValueChartProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  valueString?: string;
  displayValue?: string;
  targetLabel: string;
  targetValue?: number;
  direction?: TargetDirection;
};

type TargetDirection = 'higher-is-better' | 'lower-is-better';

function getColor(
  value: number,
  target?: number,
  direction: TargetDirection = 'higher-is-better'
) {
  if (!target) return 'text-gray-400';

  if (direction === 'higher-is-better') {
    const ratio = value / target;

    if (ratio >= 1) return 'text-green-400';
    if (ratio >= 0.7) return 'text-yellow-400';

    return 'text-red-400';
  } else {
    if (value <= target) return 'text-green-400';
    if (value <= target * 1.3) return 'text-yellow-400';

    return 'text-red-400';
  }
}

export function MySingleValueChart({
  icon,
  label,
  value,
  valueString = '',
  displayValue,
  targetLabel,
  targetValue,
  direction,
}: MySingleValueChartProps) {
  const colorClass = getColor(value, targetValue, direction);

  return (
    <Card className="flex-1 min-w-[200px] max-w-full py-8 transition-shadow">
      <CardContent className="flex items-center justify-center gap-7 px-4">
        <div className="h-17 w-17 bg-blue-200 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="flex items-end justify-center mb-1">
            {value != null || displayValue != null ? (
              <p
                className={cn('font-bold leading-none mr-1', colorClass)}
                style={{ fontSize: '40px' }}
              >
                {displayValue ? displayValue : value}
              </p>
            ) : (
              <p
                className="font-bold leading-none mr-1 text-blue-400"
                style={{ fontSize: '40px' }}
              >
                {valueString}
              </p>
            )}
            <p className="text-md font-medium text-muted-foreground ml-1 pb-[2px]">
              {targetLabel}
            </p>
          </div>
          <p className="text-lg font-semibold text-blue-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
