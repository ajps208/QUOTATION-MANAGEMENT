import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/roles';

export default function HomePage() {
  redirect(ROUTES.LOGIN);
}
