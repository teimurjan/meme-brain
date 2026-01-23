import type { HumorProfile } from '../../shared/types';
import { HUMOR_TYPES } from '../../shared/types';

type Props = {
  profile: HumorProfile;
  size?: number;
};

const HUMOR_LABELS: Record<(typeof HUMOR_TYPES)[number], string> = {
  absurdist: 'Absurdist',
  sarcastic: 'Sarcastic',
  wholesome: 'Wholesome',
  unhinged: 'Unhinged',
  deadpan: 'Deadpan',
};

export function RadarChart({ profile, size = 200 }: Props) {
  const center = size / 2;
  const radius = size * 0.35;
  const labelRadius = size * 0.48;
  const axisCount = HUMOR_TYPES.length;
  const angleStep = (2 * Math.PI) / axisCount;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + Math.cos(angle) * labelRadius,
      y: center + Math.sin(angle) * labelRadius,
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = HUMOR_TYPES.map((type, i) => getPoint(i, profile[type]));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridLevels.map((level) => {
        const points = HUMOR_TYPES.map((_, i) => getPoint(i, level));
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={path} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
      })}

      {HUMOR_TYPES.map((_, i) => {
        const endPoint = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      <path d={dataPath} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />

      {dataPoints.map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
      ))}

      {HUMOR_TYPES.map((type, i) => {
        const labelPoint = getLabelPoint(i);
        return (
          <text
            key={type}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600"
          >
            {HUMOR_LABELS[type]}
          </text>
        );
      })}
    </svg>
  );
}
