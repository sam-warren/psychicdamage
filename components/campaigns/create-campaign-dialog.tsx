'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { CampaignForm, type CampaignFormData } from '@/components/forms/campaign-form'
import { createCampaign } from '@/actions/campaigns'

interface CreateCampaignDialogProps {
  triggerText?: string
}

export function CreateCampaignDialog({ triggerText = "New Campaign" }: CreateCampaignDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onSubmit = async (data: CampaignFormData) => {
    startTransition(async () => {
      try {
        await createCampaign(data)
        setIsOpen(false)
        toast.success('Campaign created successfully')
      } catch {
        toast.error('Error creating campaign')
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign to start your D&D adventure.
          </DialogDescription>
        </DialogHeader>
        <CampaignForm
          mode="create"
          onSubmit={onSubmit}
          onCancel={() => setIsOpen(false)}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  )
} 