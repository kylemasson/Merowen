export type BagLine = {
  id: string;
  handle: string;
  name: string;
  variant: string;
  quantity: number;
  total: number;
  image: string | null;
};

export type Bag = {
  live: boolean;
  count: number;
  lines: BagLine[];
  currency: string;
  subtotal: number;
  credit: number;
  total: number;
  code: { code: string; applicable: boolean } | null;
  hasDossier: boolean;
};

export const EMPTY_BAG: Bag = {
  live: false,
  count: 0,
  lines: [],
  currency: "USD",
  subtotal: 0,
  credit: 0,
  total: 0,
  code: null,
  hasDossier: false,
};
