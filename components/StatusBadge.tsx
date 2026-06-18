import { AppointmentStatus } from '@/lib/mock-data'

const config: Record<AppointmentStatus, { label: string; className: string }> = {
  scheduled:  { label: 'Geplant',     className: 'bg-gray-100 text-gray-600' },
  reminded:   { label: 'Erinnert',    className: 'bg-blue-100 text-blue-700' },
  confirmed:  { label: 'Bestätigt',   className: 'bg-green-100 text-[#1D9E75]' },
  no_show:    { label: 'No-Show',     className: 'bg-red-100 text-[#E24B4A]' },
  completed:  { label: 'Abgeschlossen', className: 'bg-gray-200 text-gray-700' },
  rebooked:   { label: 'Umgebucht',   className: 'bg-purple-100 text-purple-700' },
}

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${className}`}>
      {label}
    </span>
  )
}
