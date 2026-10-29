export type Conservation = 'ambiante' | 'refrigere' | 'congele'

export interface Product {
  id: string
  reference: string
  codeInterne: string
  designation: string
  categorie: string
  plateforme: string
  fournisseur: string
  conservation: Conservation
  unite: string
  typeContenu: string
  nombreParUnite: number | null
  prixUnitaire: number | null
  seuilMin: number
  stockCible: number | null
  gtin: string
  suiviBoite: boolean
  remarques: string
  actif: boolean
}

export const CURRENCY = 'DA'

export const CONSERVATIONS: Record<
  Conservation,
  { label: string; range: string; short: string }
> = {
  ambiante: { label: 'Ambiante', range: '15–25 °C', short: '15–25 °C' },
  refrigere: { label: 'Réfrigéré', range: '2–8 °C', short: '2–8 °C' },
  congele: { label: 'Congelé', range: '≤ -20 °C', short: '≤ -20 °C' },
}

export const CATEGORIES = [
  'PCR syndromique',
  'Agglutination / Latex',
  'Biochimie',
  'Hématologie',
  'Immunologie / Sérologie',
  'Microbiologie',
  'Consommables',
]

export const PLATEFORMES = [
  'BioFire FilmArray',
  'Manuel',
  'Roche Cobas c311',
  'Sysmex XN-550',
  'bioMérieux VITEK 2',
]

export const FOURNISSEURS = [
  'bioMérieux',
  'Biolabo',
  'Roche Diagnostics',
  'Sysmex',
  'Bio-Rad',
  'Oxoid',
]

export const UNITES = ['Coffret', 'Paquet', 'Boîte', 'Flacon', 'Kit', 'Cartouche']

export const TYPES_CONTENU = [
  'tests',
  'pochettes',
  'disques',
  'bandelettes',
  'cartes',
  'flacons',
  'mL',
]

export function formatConditionnement(p: Pick<Product, 'unite' | 'nombreParUnite' | 'typeContenu'>) {
  if (!p.nombreParUnite) return p.unite
  return `${p.unite} · ${p.nombreParUnite} ${p.typeContenu || 'unités'}`
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    reference: '423738',
    codeInterne: 'BCID',
    designation: 'BioFire BCID2 Panel',
    categorie: 'PCR syndromique',
    plateforme: 'BioFire FilmArray',
    fournisseur: 'bioMérieux',
    conservation: 'ambiante',
    unite: 'Coffret',
    typeContenu: 'pochettes',
    nombreParUnite: 6,
    prixUnitaire: 412000,
    seuilMin: 2,
    stockCible: 6,
    gtin: '03573026591234',
    suiviBoite: true,
    remarques: 'Panel identification hémocultures positives.',
    actif: true,
  },
  {
    id: 'p2',
    reference: '423742',
    codeInterne: 'ME',
    designation: 'BioFire ME Panel (Méningite/Encéphalite)',
    categorie: 'PCR syndromique',
    plateforme: 'BioFire FilmArray',
    fournisseur: 'bioMérieux',
    conservation: 'ambiante',
    unite: 'Coffret',
    typeContenu: 'pochettes',
    nombreParUnite: 6,
    prixUnitaire: 398000,
    seuilMin: 1,
    stockCible: 3,
    gtin: '03573026591258',
    suiviBoite: true,
    remarques: '',
    actif: true,
  },
  {
    id: 'p3',
    reference: 'LA-0510',
    codeInterne: 'ASLO',
    designation: 'ASLO-Latex',
    categorie: 'Agglutination / Latex',
    plateforme: 'Manuel',
    fournisseur: 'Biolabo',
    conservation: 'refrigere',
    unite: 'Coffret',
    typeContenu: 'tests',
    nombreParUnite: 100,
    prixUnitaire: 7800,
    seuilMin: 2,
    stockCible: 5,
    gtin: '3700123456781',
    suiviBoite: false,
    remarques: 'Ne pas congeler. Agiter avant usage.',
    actif: true,
  },
  {
    id: 'p4',
    reference: 'LA-0520',
    codeInterne: 'CRP',
    designation: 'CRP-Latex',
    categorie: 'Agglutination / Latex',
    plateforme: 'Manuel',
    fournisseur: 'Biolabo',
    conservation: 'refrigere',
    unite: 'Coffret',
    typeContenu: 'tests',
    nombreParUnite: 100,
    prixUnitaire: 6500,
    seuilMin: 2,
    stockCible: 4,
    gtin: '3700123456798',
    suiviBoite: false,
    remarques: '',
    actif: true,
  },
  {
    id: 'p5',
    reference: '04404483190',
    codeInterne: 'GLU',
    designation: 'Glucose HK Gen.3',
    categorie: 'Biochimie',
    plateforme: 'Roche Cobas c311',
    fournisseur: 'Roche Diagnostics',
    conservation: 'refrigere',
    unite: 'Cartouche',
    typeContenu: 'tests',
    nombreParUnite: 800,
    prixUnitaire: 21500,
    seuilMin: 3,
    stockCible: 8,
    gtin: '04015630920591',
    suiviBoite: true,
    remarques: 'Stabilité à bord : 28 jours.',
    actif: true,
  },
  {
    id: 'p6',
    reference: 'CN-956',
    codeInterne: 'CELLPACK',
    designation: 'Cellpack DCL',
    categorie: 'Hématologie',
    plateforme: 'Sysmex XN-550',
    fournisseur: 'Sysmex',
    conservation: 'ambiante',
    unite: 'Flacon',
    typeContenu: 'mL',
    nombreParUnite: 20000,
    prixUnitaire: 18900,
    seuilMin: 2,
    stockCible: 4,
    gtin: '',
    suiviBoite: false,
    remarques: '',
    actif: true,
  },
  {
    id: 'p7',
    reference: '413432',
    codeInterne: 'AST-N372',
    designation: 'VITEK 2 AST-N372',
    categorie: 'Microbiologie',
    plateforme: 'bioMérieux VITEK 2',
    fournisseur: 'bioMérieux',
    conservation: 'refrigere',
    unite: 'Boîte',
    typeContenu: 'cartes',
    nombreParUnite: 20,
    prixUnitaire: 95000,
    seuilMin: 2,
    stockCible: 5,
    gtin: '03573026413437',
    suiviBoite: true,
    remarques: 'Antibiogramme bacilles Gram négatif.',
    actif: true,
  },
  {
    id: 'p8',
    reference: 'CT0043B',
    codeInterne: 'AMX25',
    designation: 'Disques Amoxicilline 25 µg',
    categorie: 'Microbiologie',
    plateforme: 'Manuel',
    fournisseur: 'Oxoid',
    conservation: 'congele',
    unite: 'Cartouche',
    typeContenu: 'disques',
    nombreParUnite: 50,
    prixUnitaire: 2900,
    seuilMin: 5,
    stockCible: 10,
    gtin: '',
    suiviBoite: false,
    remarques: 'Ramener à température ambiante avant ouverture.',
    actif: true,
  },
  {
    id: 'p9',
    reference: '72710',
    codeInterne: 'TPHA',
    designation: 'TPHA Syphilis',
    categorie: 'Immunologie / Sérologie',
    plateforme: 'Manuel',
    fournisseur: 'Bio-Rad',
    conservation: 'refrigere',
    unite: 'Kit',
    typeContenu: 'tests',
    nombreParUnite: 200,
    prixUnitaire: 14200,
    seuilMin: 1,
    stockCible: 2,
    gtin: '3610520727102',
    suiviBoite: false,
    remarques: '',
    actif: false,
  },
  {
    id: 'p10',
    reference: 'EB-100',
    codeInterne: '',
    designation: 'Embouts 1000 µL',
    categorie: 'Consommables',
    plateforme: 'Manuel',
    fournisseur: 'Biolabo',
    conservation: 'ambiante',
    unite: 'Paquet',
    typeContenu: 'embouts',
    nombreParUnite: 1000,
    prixUnitaire: 1200,
    seuilMin: 10,
    stockCible: 30,
    gtin: '',
    suiviBoite: false,
    remarques: '',
    actif: true,
  },
]
