import { BookOpenCheck, CalendarCheck } from 'lucide-react';

export const adminNavData = [
  {
    label: 'Tour Management',
    items: [
      {
        title: 'Tour',
        href: '/admin/tour',
        icon: BookOpenCheck,
      },
      {
        title: 'Booking',
        href: '/admin/booking',
        icon: CalendarCheck,
      },
    ],
  },
];
