export type AppointmentStatus = 'scheduled' | 'reminded' | 'confirmed' | 'no_show' | 'completed' | 'rebooked'

export type Appointment = {
  id: string
  customer_name: string
  phone_number: string
  scheduled_at: string
  duration_minutes: number
  price_value: number
  status: AppointmentStatus
  reminder_sent_at: string | null
  confirmed_at: string | null
}

const now = new Date()
const today = (h: number, m = 0) => {
  const d = new Date(now)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}
const daysAgo = (days: number, h = 10) => {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  d.setHours(h, 0, 0, 0)
  return d.toISOString()
}
const daysAhead = (days: number, h = 10) => {
  const d = new Date(now)
  d.setDate(d.getDate() + days)
  d.setHours(h, 0, 0, 0)
  return d.toISOString()
}

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    customer_name: 'Maria Müller',
    phone_number: '+49 151 1234567',
    scheduled_at: today(9, 0),
    duration_minutes: 45,
    price_value: 65,
    status: 'confirmed',
    reminder_sent_at: daysAgo(1),
    confirmed_at: daysAgo(0, 8),
  },
  {
    id: '2',
    customer_name: 'Thomas Becker',
    phone_number: '+49 160 9876543',
    scheduled_at: today(10, 30),
    duration_minutes: 60,
    price_value: 80,
    status: 'reminded',
    reminder_sent_at: daysAgo(1),
    confirmed_at: null,
  },
  {
    id: '3',
    customer_name: 'Sandra Koch',
    phone_number: '+49 172 5554433',
    scheduled_at: today(14, 0),
    duration_minutes: 30,
    price_value: 45,
    status: 'scheduled',
    reminder_sent_at: null,
    confirmed_at: null,
  },
  {
    id: '4',
    customer_name: 'Klaus Wagner',
    phone_number: '+49 176 1112233',
    scheduled_at: daysAgo(3, 11),
    duration_minutes: 45,
    price_value: 65,
    status: 'no_show',
    reminder_sent_at: daysAgo(4),
    confirmed_at: null,
  },
  {
    id: '5',
    customer_name: 'Anna Schneider',
    phone_number: '+49 151 9988776',
    scheduled_at: daysAgo(2, 14),
    duration_minutes: 60,
    price_value: 80,
    status: 'completed',
    reminder_sent_at: daysAgo(3),
    confirmed_at: daysAgo(2, 9),
  },
  {
    id: '6',
    customer_name: 'Peter Hoffmann',
    phone_number: '+49 163 4455667',
    scheduled_at: daysAgo(1, 10),
    duration_minutes: 45,
    price_value: 65,
    status: 'confirmed',
    reminder_sent_at: daysAgo(2),
    confirmed_at: daysAgo(1, 8),
  },
  {
    id: '7',
    customer_name: 'Julia Weber',
    phone_number: '+49 177 3344556',
    scheduled_at: daysAhead(1, 9),
    duration_minutes: 30,
    price_value: 45,
    status: 'scheduled',
    reminder_sent_at: null,
    confirmed_at: null,
  },
  {
    id: '8',
    customer_name: 'Frank Richter',
    phone_number: '+49 152 6677889',
    scheduled_at: daysAhead(1, 11),
    duration_minutes: 60,
    price_value: 80,
    status: 'reminded',
    reminder_sent_at: new Date().toISOString(),
    confirmed_at: null,
  },
  {
    id: '9',
    customer_name: 'Sabine Klein',
    phone_number: '+49 175 2233445',
    scheduled_at: daysAhead(2, 10),
    duration_minutes: 45,
    price_value: 65,
    status: 'scheduled',
    reminder_sent_at: null,
    confirmed_at: null,
  },
  {
    id: '10',
    customer_name: 'Markus Braun',
    phone_number: '+49 162 8899001',
    scheduled_at: daysAgo(4, 15),
    duration_minutes: 45,
    price_value: 65,
    status: 'no_show',
    reminder_sent_at: daysAgo(5),
    confirmed_at: null,
  },
]

export const MOCK_BUSINESS = {
  name: 'Physio Praxis Musterstadt',
  plan: 'pro' as 'basis' | 'pro' | 'premium',
}

export function getMockStats() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const todayCount = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.scheduled_at)
    return d >= todayStart && d <= todayEnd
  }).length

  const noShowThisWeek = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.scheduled_at)
    return a.status === 'no_show' && d >= weekStart
  }).length

  const savedThisWeek = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.scheduled_at)
    return (
      (a.status === 'confirmed' || a.status === 'completed') &&
      a.reminder_sent_at !== null &&
      d >= weekStart
    )
  }).reduce((sum, a) => sum + a.price_value, 0)

  return { todayCount, noShowThisWeek, savedThisWeek }
}

export function getUpcomingAppointments(limit = 5): Appointment[] {
  const now = new Date()
  return MOCK_APPOINTMENTS.filter((a) => new Date(a.scheduled_at) >= now)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, limit)
}
