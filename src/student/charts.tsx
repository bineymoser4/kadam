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
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
      ))}
      {data.map((item, index) => {
        const outer = point(index, 100);
        const label = point(index, 119);
        return (
          <g key={item.label}>
            <line x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.14)" />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fill="#dfff45" fontSize="11" fontWeight="900">
              {item.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygon} fill="rgba(207,255,0,0.34)" stroke="#cfff00" strokeWidth="3" />
      {data.map((item, index) => {
        const dot = point(index, item.score);
        return <circle key={item.label} cx={dot.x} cy={dot.y} r="4" fill={item.fill} stroke="#071014" strokeWidth="2" />;
      })}
      <circle cx={center} cy={center} r="3" fill="#cfff00" />
    </svg>
  );
}

export function ReadinessBars({ data }: { data: ChartDatum[] }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-500">
              <span>{item.label}</span>
              <span>{item.score}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full" style={{ width: `${clamp(item.score)}%`, backgroundColor: item.fill }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
