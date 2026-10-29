'use client'

import { useState, type ReactNode } from 'react'
import { BellRing, Boxes, FileText, IdCard, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  CATEGORIES,
  CONSERVATIONS,
  CURRENCY,
  FOURNISSEURS,
  PLATEFORMES,
  TYPES_CONTENU,
  UNITES,
  type Conservation,
  type Product,
} from '@/lib/catalogue'
import { cn } from '@/lib/utils'
import { CONSERVATION_STYLE } from './conservation-badge'

type Draft = Omit<Product, 'id' | 'nombreParUnite' | 'prixUnitaire' | 'seuilMin' | 'stockCible'> & {
  nombreParUnite: string
  prixUnitaire: string
  seuilMin: string
  stockCible: string
}

type Errors = Partial<Record<keyof Draft, string>>

const EMPTY: Draft = {
  reference: '',
  codeInterne: '',
  designation: '',
  categorie: '',
  plateforme: '',
  fournisseur: '',
  conservation: 'ambiante',
  unite: '',
  typeContenu: '',
  nombreParUnite: '',
  prixUnitaire: '',
  seuilMin: '',
  stockCible: '',
  gtin: '',
  suiviBoite: false,
  remarques: '',
  actif: true,
}

function toDraft(p: Product | null): Draft {
  if (!p) return EMPTY
  return {
    ...p,
    nombreParUnite: p.nombreParUnite?.toString() ?? '',
    prixUnitaire: p.prixUnitaire?.toString() ?? '',
    seuilMin: p.seuilMin.toString(),
    stockCible: p.stockCible?.toString() ?? '',
  }
}

function validate(d: Draft): Errors {
  const e: Errors = {}
  if (!d.designation.trim()) e.designation = 'La désignation est obligatoire.'
  if (!d.reference.trim()) e.reference = 'La référence est obligatoire.'
  if (!d.unite) e.unite = "Choisissez l'unité de commande."
  if (d.seuilMin === '' || Number(d.seuilMin) < 0) e.seuilMin = 'Indiquez un seuil (0 ou plus).'
  if (d.gtin && !/^\d{8,14}$/.test(d.gtin)) e.gtin = 'Le GTIN doit contenir 8 à 14 chiffres.'
  if (d.stockCible && d.seuilMin && Number(d.stockCible) < Number(d.seuilMin))
    e.stockCible = 'Le stock cible doit être ≥ au seuil minimum.'
  return e
}

const numOrNull = (v: string) => (v === '' ? null : Number(v))

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Omit<Product, 'id'>, id?: string) => void
}

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {open && (
          <ProductForm
            key={product?.id ?? 'new'}
            product={product}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ProductForm({
  product,
  onCancel,
  onSave,
}: {
  product: Product | null
  onCancel: () => void
  onSave: ProductDialogProps['onSave']
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(product))
  const [errors, setErrors] = useState<Errors>({})
  const isEdit = Boolean(product)

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const found = validate(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    onSave(
      {
        ...draft,
        reference: draft.reference.trim(),
        designation: draft.designation.trim(),
        codeInterne: draft.codeInterne.trim(),
        nombreParUnite: numOrNull(draft.nombreParUnite),
        prixUnitaire: numOrNull(draft.prixUnitaire),
        seuilMin: Number(draft.seuilMin),
        stockCible: numOrNull(draft.stockCible),
      },
      product?.id,
    )
  }

  const uniteLabel = draft.unite ? draft.unite.toLowerCase() : 'unités'
  const preview =
    draft.unite && draft.nombreParUnite
      ? `1 ${draft.unite.toLowerCase()} contient ${draft.nombreParUnite} ${draft.typeContenu || 'éléments'}`
      : null

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <header className="border-b px-6 pt-5 pb-4">
        <DialogTitle className="text-lg font-semibold">
          {isEdit ? 'Modifier la fiche produit' : 'Nouveau produit'}
        </DialogTitle>
        <DialogDescription className="mt-1.5">
          {"Décrivez l'identité et les caractéristiques fixes du produit. Les lots, quantités et péremptions se saisissent à la réception, dans Stock."}
        </DialogDescription>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/40 px-6 py-5">
        <div className="flex flex-col gap-4">
          <Section icon={IdCard} step={1} title="Identification" hint="Comment reconnaître ce produit.">
            <div className="grid gap-4 sm:grid-cols-6">
              <Field id="designation" label="Désignation" required error={errors.designation} className="sm:col-span-6">
                <Input
                  id="f-designation"
                  value={draft.designation}
                  onChange={(e) => set('designation', e.target.value)}
                  placeholder="ex. BioFire BCID2 Panel"
                  aria-invalid={!!errors.designation}
                  className="h-10 text-base"
                  autoFocus
                />
              </Field>
              <Field id="reference" label="Référence fournisseur" required error={errors.reference} className="sm:col-span-2">
                <Input
                  id="f-reference"
                  value={draft.reference}
                  onChange={(e) => set('reference', e.target.value)}
                  placeholder="ex. 423738"
                  aria-invalid={!!errors.reference}
                  className="font-mono"
                />
              </Field>
              <Field id="codeInterne" label="Code interne" hint="Abréviation labo" className="sm:col-span-2">
                <Input
                  id="f-codeInterne"
                  value={draft.codeInterne}
                  onChange={(e) => set('codeInterne', e.target.value.toUpperCase())}
                  placeholder="ex. BCID"
                  className="font-mono"
                />
              </Field>
              <Field id="gtin" label="GTIN (code-barres)" hint="8 à 14 chiffres" error={errors.gtin} className="sm:col-span-2">
                <Input
                  id="f-gtin"
                  value={draft.gtin}
                  onChange={(e) => set('gtin', e.target.value.replace(/\D/g, '').slice(0, 14))}
                  inputMode="numeric"
                  placeholder="Scanner ou saisir"
                  aria-invalid={!!errors.gtin}
                  className="font-mono"
                />
              </Field>
            </div>
          </Section>

          <Section icon={Tags} step={2} title="Classification" hint="Pour classer et retrouver le produit.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="categorie" label="Catégorie">
                <OptionSelect id="f-categorie" value={draft.categorie} onChange={(v) => set('categorie', v)} options={CATEGORIES} placeholder="Choisir…" />
              </Field>
              <Field id="plateforme" label="Plateforme / automate">
                <OptionSelect id="f-plateforme" value={draft.plateforme} onChange={(v) => set('plateforme', v)} options={PLATEFORMES} placeholder="Choisir…" />
              </Field>
              <Field id="fournisseur" label="Fournisseur">
                <OptionSelect id="f-fournisseur" value={draft.fournisseur} onChange={(v) => set('fournisseur', v)} options={FOURNISSEURS} placeholder="Choisir…" />
              </Field>
            </div>
          </Section>

          <Section icon={Boxes} step={3} title="Conditionnement & conservation" hint="Comment le produit est livré et stocké.">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">
                Conservation <span className="text-destructive" aria-hidden="true">*</span>
                <span className="sr-only">(obligatoire)</span>
              </legend>
              <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(CONSERVATIONS) as Conservation[]).map((key) => {
                  const { icon: Icon, className } = CONSERVATION_STYLE[key]
                  const checked = draft.conservation === key
                  return (
                    <label
                      key={key}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                        checked ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/40',
                      )}
                    >
                      <input
                        type="radio"
                        name="conservation"
                        value={key}
                        checked={checked}
                        onChange={() => set('conservation', key)}
                        className="sr-only"
                      />
                      <span className={cn('flex size-9 items-center justify-center rounded-md ring-1 ring-inset', className)}>
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-medium">{CONSERVATIONS[key].label}</span>
                        <span className="block text-xs text-muted-foreground">{CONSERVATIONS[key].range}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field id="unite" label="Unité de commande" required error={errors.unite}>
                <OptionSelect id="f-unite" value={draft.unite} onChange={(v) => set('unite', v)} options={UNITES} placeholder="ex. Coffret" invalid={!!errors.unite} />
              </Field>
              <Field id="nombreParUnite" label="Nombre par unité">
                <Input
                  id="f-nombreParUnite"
                  type="number"
                  min={1}
                  value={draft.nombreParUnite}
                  onChange={(e) => set('nombreParUnite', e.target.value)}
                  placeholder="ex. 25"
                />
              </Field>
              <Field id="typeContenu" label="Type de contenu">
                <OptionSelect id="f-typeContenu" value={draft.typeContenu} onChange={(v) => set('typeContenu', v)} options={TYPES_CONTENU} placeholder="ex. disques" />
              </Field>
            </div>
            <p className="mt-3 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground" aria-live="polite">
              {preview ? (
                <>
                  <span className="font-medium">Aperçu :</span> {preview}.
                </>
              ) : (
                <span className="text-muted-foreground">
                  {"Aperçu : renseignez l'unité et le nombre par unité (ex. 1 cartouche contient 25 disques)."}
                </span>
              )}
            </p>
          </Section>

          <Section icon={BellRing} step={4} title="Règles de gestion" hint="Paramètres d'alerte et de suivi appliqués au stock.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="seuilMin" label="Seuil minimum" required hint={`Alerte en dessous de, en ${uniteLabel}`} error={errors.seuilMin}>
                <Input
                  id="f-seuilMin"
                  type="number"
                  min={0}
                  value={draft.seuilMin}
                  onChange={(e) => set('seuilMin', e.target.value)}
                  placeholder="ex. 2"
                  aria-invalid={!!errors.seuilMin}
                />
              </Field>
              <Field id="stockCible" label="Stock cible" hint={`Niveau idéal, en ${uniteLabel}`} error={errors.stockCible}>
                <Input
                  id="f-stockCible"
                  type="number"
                  min={0}
                  value={draft.stockCible}
                  onChange={(e) => set('stockCible', e.target.value)}
                  placeholder="ex. 6"
                  aria-invalid={!!errors.stockCible}
                />
              </Field>
              <Field id="prixUnitaire" label="Prix unitaire" hint={draft.unite ? `Par ${draft.unite.toLowerCase()}` : 'Par unité de commande'}>
                <div className="relative">
                  <Input
                    id="f-prixUnitaire"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.prixUnitaire}
                    onChange={(e) => set('prixUnitaire', e.target.value)}
                    placeholder="0,00"
                    className="pr-10"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                    {CURRENCY}
                  </span>
                </div>
              </Field>
            </div>

            <label
              htmlFor="f-suiviBoite"
              className="mt-4 flex cursor-pointer items-start justify-between gap-4 rounded-lg border bg-card p-3.5"
            >
              <span className="leading-snug">
                <span className="block text-sm font-medium">{"Suivi de l'utilisation au laboratoire (boîte par boîte)"}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {"Chaque boîte reçoit une étiquette et son ouverture / fin d'utilisation est enregistrée."}
                </span>
              </span>
              <Switch
                id="f-suiviBoite"
                checked={draft.suiviBoite}
                onCheckedChange={(v) => set('suiviBoite', v)}
                className="mt-0.5"
              />
            </label>
          </Section>

          <Section icon={FileText} step={5} title="Remarques" hint="Facultatif">
            <Label htmlFor="f-remarques" className="sr-only">Remarques</Label>
            <Textarea
              id="f-remarques"
              value={draft.remarques}
              onChange={(e) => set('remarques', e.target.value)}
              placeholder="Précautions d'emploi, stabilité après ouverture, informations utiles…"
              rows={3}
            />
          </Section>
        </div>
      </div>

      <footer className="flex flex-col-reverse items-stretch gap-3 border-t bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="f-actif" className="flex cursor-pointer items-center gap-3 text-sm">
          <Switch id="f-actif" checked={draft.actif} onCheckedChange={(v) => set('actif', v)} />
          <span>
            <span className="font-medium">{draft.actif ? 'Produit actif' : 'Produit inactif'}</span>
            <span className="block text-xs text-muted-foreground">
              {draft.actif ? 'Disponible pour les commandes et réceptions' : 'Masqué des listes de saisie'}
            </span>
          </span>
        </label>
        <div className="flex gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} className="h-9 flex-1 sm:flex-none">
            Annuler
          </Button>
          <Button type="submit" className="h-9 flex-1 px-4 sm:flex-none">
            {isEdit ? 'Enregistrer les modifications' : 'Créer la fiche'}
          </Button>
        </div>
      </footer>
    </form>
  )
}

function Section({
  icon: Icon,
  step,
  title,
  hint,
  children,
}: {
  icon: typeof IdCard
  step: number
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={`section-${step}`} className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <h3 id={`section-${step}`} className="text-sm font-semibold">
            <span className="text-muted-foreground">{step}. </span>
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={`f-${id}`} className="text-sm font-medium">
        {label}
        {required && (
          <>
            <span className="text-destructive" aria-hidden="true">*</span>
            <span className="sr-only">(obligatoire)</span>
          </>
        )}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

function OptionSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  invalid?: boolean
}) {
  return (
    <Select value={value || null} onValueChange={(v) => onChange((v as string) ?? '')}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
