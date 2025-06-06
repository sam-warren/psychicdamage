'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { monsterService, CreateMonsterData, UpdateMonsterData } from '@/services/monsters'

export async function createMonster(data: CreateMonsterData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    try {
        await monsterService.createMonster(user.id, data)
        revalidatePath('/creatures')
    } catch {
        throw new Error('Failed to create monster')
    }
}

export async function updateMonster(monsterId: string, data: UpdateMonsterData) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    try {
        await monsterService.updateMonster(monsterId, user.id, data)
        revalidatePath('/creatures')
    } catch {
        throw new Error('Failed to update monster')
    }
}

export async function deleteMonster(monsterId: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('Unauthorized')
    }

    try {
        await monsterService.deleteMonster(monsterId, user.id)
        revalidatePath('/creatures')
    } catch {
        throw new Error('Failed to delete monster')
    }
} 