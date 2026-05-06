'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface TrendChartProps {
  data: { date: string; count: number }[]
  title: string
}

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
      <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 20 }}>{title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#1C2936" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#3D5065', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#3D5065', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0C1118', border: '1px solid #1C2936', borderRadius: 0, fontFamily: 'monospace', fontSize: 10 }}
            labelStyle={{ color: '#7D8A97' }}
            itemStyle={{ color: '#E8A020' }}
          />
          <Line type="monotone" dataKey="count" stroke="#E8A020" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

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
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#1C2936" strokeDasharray="0" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#3D5065', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#3D5065', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0C1118', border: '1px solid #1C2936', borderRadius: 0, fontFamily: 'monospace', fontSize: 10 }}
            labelStyle={{ color: '#7D8A97' }}
            itemStyle={{ color: color }}
          />
          <Bar dataKey="value" fill={color} radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const PALETTE = ['#E8A020', '#2EA8FF', '#34D399', '#F05252', '#A78BFA', '#FB7185']

interface DonutProps {
  data: { label: string; value: number }[]
  title: string
}

export function DonutChartPanel({ data, title }: DonutProps) {
  return (
    <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
      <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 20 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <PieChart width={120} height={120}>
          <Pie data={data} dataKey="value" nameKey="label" cx={60} cy={60} innerRadius={38} outerRadius={55} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
        </PieChart>
        <div style={{ flex: 1 }}>
          {data.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, background: PALETTE[i % PALETTE.length] }} />
                <span style={{ color: '#7D8A97', fontSize: 10, letterSpacing: '0.1em' }}>{d.label}</span>
              </div>
              <span style={{ color: '#CDD6E0', fontSize: 10 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
