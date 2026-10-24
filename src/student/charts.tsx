import { clamp } from "../shared/format";

export interface ChartDatum {
  label: string;
  score: number;
  fill: string;
}

export function ReadinessRadar({ data }: { data: ChartDatum[] }) {
  const size = 250;
  const center = size / 2;
  const radius = 86;
  const total = data.length || 1;
  const point = (index: number, value = 100) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / total;
    const distance = (radius * value) / 100;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  };
  const polygon = data.map((item, index) => point(index, item.score)).map((dot) => `${dot.x},${dot.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label="Диаграмма готовности">
      {[25, 50, 75, 100].map((level) => (
        <polygon
          key={level}
          points={data.map((_, index) => point(index, level)).map((dot) => `${dot.x},${dot.y}`).join(" ")}
          fill="none"
          stroke="#E3E6E1"
          strokeWidth="1"
        />
      ))}
      {data.map((item, index) => {
        const outer = point(index, 100);
        const label = point(index, 119);
        return (
          <g key={item.label}>
            <line x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="#E3E6E1" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize="11" fontWeight="800">
              {item.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygon} fill="rgba(31,122,83,0.18)" stroke="#1f7a53" strokeWidth="2" />
      {data.map((item, index) => {
        const dot = point(index, item.score);
        return <circle key={item.label} cx={dot.x} cy={dot.y} r="4" fill={item.fill} stroke="white" strokeWidth="2" />;
      })}
      <circle cx={center} cy={center} r="3" fill="#1f7a53" />
    </svg>
  );
}

export function ReadinessBars({ data }: { data: ChartDatum[] }) {
  return (
    <div className="rounded-md border border-[var(--color-line)] bg-white p-4">
      <div className="space-y-2.5">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{item.label}</span>
              <span>{item.score}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-sm bg-slate-100">
              <div className="h-full rounded-sm" style={{ width: `${clamp(item.score)}%`, backgroundColor: item.fill }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
