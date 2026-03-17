export type ShuttlesKpi = {
  total: number;
  online: number;
  unstable: number;
  error: number;
  offline: number;
  byTerritory: Record<
    string,
    {
      total: number;
      online: number;
      unstable: number;
      error: number;
      offline: number;
    }
  >;
};
