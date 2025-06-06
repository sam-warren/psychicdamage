import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { monsterService } from '@/services/monsters'
import { CreaturesDataTable } from '@/components/creatures/creatures-table'

export default async function CreaturesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  // Fetch all monsters
  const monsters = await monsterService.getMonsters()

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Creatures</h1>
            <p className="text-muted-foreground">
              Browse and manage creatures for your campaigns
            </p>
          </div>
        </div>

        <CreaturesDataTable data={monsters} />
      </div>
    </div>
  )
}
