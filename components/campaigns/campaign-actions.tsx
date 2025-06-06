'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { CampaignForm, type CampaignFormData } from '@/components/forms/campaign-form'
import { Tables } from '@/types/database'
import { updateCampaign, deleteCampaign } from '@/actions/campaigns'

type Campaign = Tables<'campaigns'>

interface CampaignActionsProps {
  campaign: Campaign
}

export function CampaignActions({ campaign }: CampaignActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onEdit = async (data: CampaignFormData) => {
    startTransition(async () => {
      try {
        await updateCampaign(campaign.id, data)
        setIsEditDialogOpen(false)
        toast.success('Campaign updated successfully')
      } catch {
        toast.error('Error updating campaign')
      }
    })
  }

  const onDelete = async () => {
    startTransition(async () => {
      try {
        await deleteCampaign(campaign.id)
        toast.success('Campaign deleted successfully')
      } catch {
        toast.error('Error deleting campaign')
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{campaign.title}&quot;? This action cannot be undone and will delete all associated players, encounters, and notes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isPending}
                >
                  Delete Campaign
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign details.
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            mode="edit"
            campaign={campaign}
            onSubmit={onEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            isSubmitting={isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  )
} 