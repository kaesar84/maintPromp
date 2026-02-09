import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Ir directo al dashboard sin login
  redirect('/dashboard')
}
