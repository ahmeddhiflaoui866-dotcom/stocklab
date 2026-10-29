'use client'

import { MoreHorizontal, Pencil, Power, PowerOff, ScanBarcode, SearchX, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatConditionnement, type Product } from '@/lib/catalogue'
import { cn } from '@/lib/utils'
import { ConservationBadge } from './conservation-badge'

interface CatalogueTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onToggleActive: (product: Product) => void
  onDelete: (product: Product) => void
}

export function CatalogueTable({ products, onEdit, onToggleActive, onDelete }: CatalogueTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="font-medium">Aucune fiche produit ne correspond</p>
        <p className="text-sm text-muted-foreground">
          Modifiez la recherche ou les filtres, ou créez une nouvelle fiche.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th scope="col" className="py-3 pr-4 pl-5 font-medium">Produit</th>
            <th scope="col" className="px-4 py-3 font-medium">Catégorie · Plateforme</th>
            <th scope="col" className="px-4 py-3 font-medium">Fournisseur</th>
            <th scope="col" className="px-4 py-3 font-medium">Conservation</th>
            <th scope="col" className="px-4 py-3 font-medium">Conditionnement</th>
            <th scope="col" className="px-4 py-3 font-medium">Statut</th>
            <th scope="col" className="py-3 pr-5 pl-2 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              onClick={() => onEdit(p)}
              className={cn(
                'group cursor-pointer border-b transition-colors last:border-0 hover:bg-accent/60',
                !p.actif && 'bg-muted/60 text-muted-foreground',
              )}
            >
              <td className="py-3.5 pr-4 pl-5">
                <div className="flex flex-col gap-1">
                  <span className={cn('font-medium text-pretty', p.actif ? 'text-foreground' : 'text-muted-foreground')}>
                    {p.designation}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">Réf. {p.reference}</span>
                    {p.codeInterne && (
                      <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-medium text-secondary-foreground">
                        {p.codeInterne}
                      </span>
                    )}
                    {p.suiviBoite && (
                      <span className="inline-flex items-center gap-1 text-primary" title="Suivi de l'utilisation boîte par boîte">
                        <ScanBarcode className="size-3.5" aria-hidden="true" />
                        Suivi par boîte
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex flex-col gap-0.5">
                  <span className={cn('whitespace-nowrap', p.actif && 'text-foreground')}>{p.categorie || '—'}</span>
                  <span className="text-xs text-muted-foreground">{p.plateforme || '—'}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">{p.fournisseur || '—'}</td>
              <td className="px-4 py-3.5">
                <ConservationBadge value={p.conservation} />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">{formatConditionnement(p)}</td>
              <td className="px-4 py-3.5">
                {p.actif ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                    Inactif
                  </span>
                )}
              </td>
              <td className="py-3.5 pr-5 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(p)}
                    className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Pencil aria-hidden="true" />
                    Modifier
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${p.designation}`} />
                      }
                    >
                      <MoreHorizontal aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onEdit(p)}>
                        <Pencil aria-hidden="true" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(p)}>
                        {p.actif ? <PowerOff aria-hidden="true" /> : <Power aria-hidden="true" />}
                        {p.actif ? 'Désactiver' : 'Réactiver'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(p)}>
                        <Trash2 aria-hidden="true" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
