import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAdminAuthenticated()
  if (!auth) redirect('/admin/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: 200, minHeight: '100vh', position: 'relative' }}>
        {/* Grid overlay */}
        <div style={{
          position: 'fixed', inset: 0, marginLeft: 200, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(30,60,90,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30,60,90,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
