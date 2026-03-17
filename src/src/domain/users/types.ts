export interface UsersKpiGlobal {
  total: number;
  connected: number;
}

export interface UsersKpiByTerritory {
  [territoryId: string]: {
    total: number;
    connected: number;
  };
}

export interface UsersKpiResponse {
  total: number;
  connected: number;
  byTerritory: UsersKpiByTerritory;
}

export interface UsersHistoryPoint {
  hour: string;
  connected: number;
}

export interface UsersHistoryResponse {
  points: UsersHistoryPoint[];
}

