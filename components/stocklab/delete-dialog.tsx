'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Product } from '@/lib/catalogue'

interface DeleteDialogProps {
  product: Product | null
  onCancel: () => void
  onConfirm: (product: Product) => void
  onDeactivate: (product: Product) => void
}

export function DeleteDialog({ product, onCancel, onConfirm, onDeactivate }: DeleteDialogProps) {
  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supprimer cette fiche produit ?</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{product?.designation}</span> sera définitivement retiré du
            catalogue. Si le produit a déjà un historique de stock, préférez la désactivation pour le conserver.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
          {product?.actif && (
            <Button variant="secondary" onClick={() => product && onDeactivate(product)}>
              Désactiver plutôt
            </Button>
          )}
          <Button variant="destructive" onClick={() => product && onConfirm(product)}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
