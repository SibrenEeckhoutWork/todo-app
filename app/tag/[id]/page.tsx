import { TagView } from '@/components/views/TagView'
import { SEED_TAGS } from '@/lib/seed'

export function generateStaticParams() {
  return SEED_TAGS.map((t) => ({ id: t.id }))
}

export default async function TagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TagView tagId={id} />
}
