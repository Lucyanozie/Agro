import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const AXIS = { fontSize: 13, fill: '#475467' };
export function EarningsChart({ data, height = 280, unit = 'k', }) {
    return (<div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 4 }} barCategoryGap="28%">
          <CartesianGrid stroke="#EEF1EE" vertical={false}/>
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={{ stroke: '#D8E6D8' }} dy={6}/>
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44}/>
          <Tooltip cursor={{ fill: 'rgba(46,145,56,.08)' }} contentStyle={{
            borderRadius: 12,
            border: '1px solid #E7EAE6',
            boxShadow: '0 8px 24px rgba(16,24,40,.10)',
            fontSize: 13,
        }} formatter={(value) => [`${Number(value)}${unit}`, 'Earnings']}/>
          <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive>
            {data.map((entry) => (<Cell key={entry.label} fill="#2E8B2E"/>))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>);
}
