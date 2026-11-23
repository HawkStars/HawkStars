/** Floor names as the model tags them (extras `piso`) and as visitors read them. */
export const FLOOR_LABELS: Record<string, string> = {
  P0: 'Piso 0',
  P1: 'Piso 1',
  P2: 'Piso 2',
  TETO: 'Cobertura',
};

export const floorLabel = (floor: string | null | undefined) =>
  (floor && FLOOR_LABELS[floor]) ?? floor ?? '';
