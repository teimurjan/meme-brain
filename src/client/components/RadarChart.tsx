import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import type { HumorProfile } from '../../shared/types';
import { HUMOR_TYPES } from '../../shared/types';

type Props = {
  profile: HumorProfile;
  size?: number;
};

export function RadarChart({ profile, size = 300 }: Props) {
  const data = HUMOR_TYPES.map((type) => ({
    subject: type[0]?.toUpperCase() + type.slice(1),
    value: Number((profile[type] * 10).toFixed(1)),
    fullMark: 10,
  }));

  return (
    <RechartsRadar
      className="pointer-events-none"
      height={size}
      width="100%"
      data={data}
      margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
    >
      <PolarGrid stroke="#000000" strokeWidth={2} strokeOpacity={0.2} />
      <PolarAngleAxis
        dataKey="subject"
        tick={{
          fill: '#000000',
          fontWeight: 700,
          fontSize: 14,
        }}
      />
      <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} stroke="#000000" strokeWidth={2} />
      <Radar
        name="Humor Profile"
        dataKey="value"
        stroke="#000000"
        strokeWidth={3}
        fill="#FF4500"
        fillOpacity={0.7}
        dot={{
          stroke: '#000000',
          strokeWidth: 3,
          fill: '#FF4500',
          r: 7,
        }}
      />
    </RechartsRadar>
  );
}
