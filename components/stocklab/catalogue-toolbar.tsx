'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CATEGORIES, PLATEFORMES } from '@/lib/catalogue'

export const ALL = 'all'

interface CatalogueToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  categorie: string
  onCategorieChange: (value: string) => void
  plateforme: string
  onPlateformeChange: (value: string) => void
  showInactive: boolean
  onShowInactiveChange: (value: boolean) => void
}

const categorieItems = [{ value: ALL, label: 'Toutes les catégories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]
const plateformeItems = [{ value: ALL, label: 'Toutes les plateformes' }, ...PLATEFORMES.map((p) => ({ value: p, label: p }))]

export function CatalogueToolbar(props: CatalogueToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
      <div className="relative min-w-64 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="Rechercher par désignation, référence, code interne ou GTIN…"
          aria-label="Rechercher un produit"
          className="h-9 pl-9"
        />
      </div>

      <Select
        items={categorieItems}
        value={props.categorie}
        onValueChange={(v) => props.onCategorieChange((v as string) ?? ALL)}
      >
        <SelectTrigger className="h-9 w-52" aria-label="Filtrer par catégorie">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categorieItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={plateformeItems}
        value={props.plateforme}
        onValueChange={(v) => props.onPlateformeChange((v as string) ?? ALL)}
      >
        <SelectTrigger className="h-9 w-52" aria-label="Filtrer par plateforme">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {plateformeItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="flex cursor-pointer items-center gap-2 pl-1 text-sm text-muted-foreground select-none">
        <Switch checked={props.showInactive} onCheckedChange={(v) => props.onShowInactiveChange(v)} />
        Afficher les inactifs
      </label>
    </div>
  )
}
