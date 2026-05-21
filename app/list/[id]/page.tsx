import { ListView } from '@/components/views/ListView'
import { SEED_LISTS } from '@/lib/seed'

// Pre-render seed list routes at build time.
// User-created lists are navigated to client-side (next/link) and still work.
export function generateStaticParams() {
  return SEED_LISTS.map((l) => ({ id: l.id }))
}

export default async function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ListView listId={id} />
}
