'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tables } from '@/types/database'

export const campaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

export type CampaignFormData = z.infer<typeof campaignSchema>
type Campaign = Tables<'campaigns'>

interface CampaignFormProps {
  mode: 'create' | 'edit'
  campaign?: Campaign | null
  onSubmit: (data: CampaignFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  className?: string
}

export function CampaignForm({
  mode,
  campaign,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: CampaignFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign
      ? {
          title: campaign.title,
          description: campaign.description || '',
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            placeholder="Enter campaign title"
            {...register('title')}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter campaign description"
            {...register('description')}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Campaign'
                : 'Update Campaign'}
          </Button>
        </div>
      </div>
    </form>
  )
}
