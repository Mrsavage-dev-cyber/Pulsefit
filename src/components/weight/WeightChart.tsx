import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dayLabel, rollingAverage } from '../../lib/calculations'
import type { WeightEntry } from '../../types'

interface WeightChartProps {
  entries: WeightEntry[]
  rangeDays: number
  goalWeightKg: number
  startWeightKg: number
  startDate: string
  weeklyRateKg: number
}

interface ChartPoint {
  date: string
  raw: number
  avg: number | null
  target: number
}

export function WeightChart({ entries, rangeDays, goalWeightKg, startWeightKg, startDate, weeklyRateKg }: WeightChartProps) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const values = sorted.map((e) => e.weightKg)
  const avgAll = rollingAverage(values, 7)

  const visible = sorted.slice(-rangeDays)
  const avgVisible = avgAll.slice(-rangeDays)

  const direction = Math.sign(goalWeightKg - startWeightKg)
  const dailyRate = weeklyRateKg / 7

  const data: ChartPoint[] = visible.map((entry, i) => {
    const daysFromStart = (new Date(entry.date).getTime() - new Date(startDate).getTime()) / 86400000
    let target = startWeightKg + dailyRate * daysFromStart
    if (direction > 0) target = Math.min(target, goalWeightKg)
    else if (direction < 0) target = Math.max(target, goalWeightKg)
    return {
      date: entry.date,
      raw: entry.weightKg,
      avg: avgVisible[i],
      target: Math.round(target * 10) / 10,
    }
  })

  const weights = data.map((d) => d.raw)
  const min = Math.min(...weights, goalWeightKg) - 1
  const max = Math.max(...weights, goalWeightKg) + 1

  const lastAvgOffset = [...data].reverse().findIndex((d) => d.avg !== null)
  const lastPoint = lastAvgOffset >= 0 ? data[data.length - 1 - lastAvgOffset] : null
  const lastValue = lastPoint ? (lastPoint.avg ?? lastPoint.raw) : null

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 8, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="weightAvgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={dayLabel}
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            axisLine={{ stroke: 'var(--color-border-strong)' }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            domain={[min, max]}
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            axisLine={false}
            tickLine={false}
            width={42}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-border-strong)', strokeWidth: 1 }} />
          <Line
            dataKey="target"
            stroke="var(--color-orange)"
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            dot={false}
            connectNulls
            type="linear"
            isAnimationActive={false}
          />
          <Scatter dataKey="raw" fill="var(--color-text-muted)" stroke="var(--color-surface)" strokeWidth={2} r={4} isAnimationActive={false} />
          <Area
            dataKey="avg"
            stroke="var(--color-brand)"
            strokeWidth={2}
            strokeLinecap="round"
            fill="url(#weightAvgFill)"
            dot={false}
            connectNulls
            type="monotone"
            activeDot={{ r: 5, fill: 'var(--color-brand)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
          />
          {lastPoint && lastValue != null && (
            <ReferenceDot
              x={lastPoint.date}
              y={lastValue}
              r={5}
              fill="var(--color-brand)"
              stroke="var(--color-surface)"
              strokeWidth={2}
              label={{
                value: `${lastValue.toFixed(1)} kg`,
                position: 'left',
                offset: 10,
                fill: 'var(--color-text)',
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-[var(--color-text-secondary)]">
        <Legend swatch="var(--color-text-muted)" label="Daily weigh-in" dot />
        <Legend swatch="var(--color-brand)" label="7-day average" />
        <Legend swatch="var(--color-orange)" label="Target trend" dashed />
      </div>
    </div>
  )
}

function Legend({ swatch, label, dashed, dot }: { swatch: string; label: string; dashed?: boolean; dot?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {dot ? (
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: swatch }} />
      ) : (
        <span
          className="inline-block h-0.5 w-4"
          style={{ backgroundColor: swatch, ...(dashed ? { backgroundImage: `linear-gradient(90deg, ${swatch} 60%, transparent 40%)`, backgroundSize: '6px 2px' } : {}) }}
        />
      )}
      {label}
    </span>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const raw = payload.find((p: any) => p.dataKey === 'raw')?.value
  const avg = payload.find((p: any) => p.dataKey === 'avg')?.value
  const target = payload.find((p: any) => p.dataKey === 'target')?.value
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-[var(--color-text)]">{dayLabel(label)}</p>
      <div className="space-y-1">
        {raw != null && (
          <p className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-text-muted)' }} />
            Weigh-in <span className="tabular ml-auto font-semibold text-[var(--color-text)]">{raw.toFixed(1)} kg</span>
          </p>
        )}
        {avg != null && (
          <p className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-brand)' }} />
            7-day avg <span className="tabular ml-auto font-semibold text-[var(--color-brand)]">{avg.toFixed(1)} kg</span>
          </p>
        )}
        {target != null && (
          <p className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-orange)' }} />
            Target <span className="tabular ml-auto font-semibold text-[var(--color-orange)]">{target.toFixed(1)} kg</span>
          </p>
        )}
      </div>
    </div>
  )
}
