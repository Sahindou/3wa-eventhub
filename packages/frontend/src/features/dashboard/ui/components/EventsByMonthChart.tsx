import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Typography } from '@mui/material'

interface Props {
  data: { month: string; count: number }[]
}

export const EventsByMonthChart = ({ data }: Props) => {
  if (data.length === 0) {
    return <Typography color="text.secondary">Aucune donnée disponible</Typography>
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
