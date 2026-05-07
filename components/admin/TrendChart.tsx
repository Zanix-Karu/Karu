'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, ReferenceLine,
} from 'recharts'

// ── Shared tooltip style ─────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: '#0C1118', border: '1px solid #253040', borderRadius: 0,
    fontFamily: '"JetBrains Mono", monospace', fontSize: 10, padding: '8px 12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  },
  labelStyle: { color: '#7D8A97', marginBottom: 4, letterSpacing: '0.1em' },
  itemStyle: { color: '#E8A020', letterSpacing: '0.05em' },
  cursor: { stroke: '#E8A020', strokeWidth: 1, strokeDasharray: '4 4' },
}

const axisStyle = { fill: '#3D5065', fontSize: 9, fontFamily: '"JetBrains Mono", monospace' }

// ── Trend line chart ─────────────────────────────────────────────────────────

interface TrendChartProps {
  data: { date: string; count: number }[]
  title: string
}

export function TrendChart({ data, title }: TrendChartProps) {
  const max = Math.max(...data.map(d => d.count), 1)
  const avg = Math.round(data.reduce((s, d) => s + d.count, 0) / Math.max(data.length, 1))

  return (
    <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em' }}>{title}</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#3D5065', fontSize: 8, letterSpacing: '0.1em' }}>PEAK</div>
            <div style={{ color: '#E8A020', fontSize: 12, fontWeight: 700 }}>{max}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#3D5065', fontSize: 8, letterSpacing: '0.1em' }}>AVG/DAY</div>
            <div style={{ color: '#7D8A97', fontSize: 12 }}>{avg}</div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid stroke="#111920" strokeDasharray="0" vertical={false} />
          <ReferenceLine y={avg} stroke="#253040" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => [v, 'SIGNUPS']} />
          <Line
            type="monotone" dataKey="count" stroke="#E8A020" strokeWidth={1.5}
            dot={false} activeDot={{ r: 4, fill: '#E8A020', stroke: '#060A0E', strokeWidth: 2 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Bar chart ────────────────────────────────────────────────────────────────

interface BarProps {
  data: { label: string; value: number }[]
  title: string
  color?: string
}

export function BarChartPanel({ data, title, color = '#E8A020' }: BarProps) {
  return (
    <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
      <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 20 }}>{title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid stroke="#111920" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            {...tooltipStyle}
            cursor={{ fill: 'rgba(232,160,32,0.06)' }}
            formatter={(v: number) => [v, 'COUNT']}
          />
          <Bar dataKey="value" fill={color} radius={0} isAnimationActive maxBarSize={48}
            onMouseEnter={(_: unknown, index: number) => void index}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Donut chart ──────────────────────────────────────────────────────────────

const PALETTE = ['#E8A020', '#2EA8FF', '#34D399', '#F05252', '#A78BFA', '#FB7185', '#6EE7B7', '#FCD34D']

interface DonutProps {
  data: { label: string; value: number }[]
  title: string
}

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) {
  if (percent < 0.06) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#060A0E" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 8, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DonutChartPanel({ data, title }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
      <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <PieChart width={130} height={130}>
          <Pie
            data={data} dataKey="value" nameKey="label"
            cx={65} cy={65} innerRadius={38} outerRadius={60}
            strokeWidth={0} isAnimationActive
            labelLine={false}
            label={(props: CustomLabelProps) => <CustomLabel {...props} />}
          >
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0C1118', border: '1px solid #253040', borderRadius: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: 10 }}
            itemStyle={{ color: '#CDD6E0' }}
            formatter={(v: number, name: string) => [`${v} (${Math.round(v / Math.max(total, 1) * 100)}%)`, name]}
          />
        </PieChart>
        <div style={{ flex: 1 }}>
          {data.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 7, height: 7, background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                <span style={{ color: '#7D8A97', fontSize: 9, letterSpacing: '0.08em' }}>{d.label}</span>
              </div>
              <span style={{ color: '#CDD6E0', fontSize: 10, fontWeight: 700 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
