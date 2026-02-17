export interface WantedEffects {
  base: string;
  additional: string;
  skill: string;
}

export interface RarityMap {
  6?: string[];
  5?: string[];
  4?: string[];
  other?: string[];
}

export interface PatternGroup {
  mode: string;
  patternCount: number;
  baseChoicesList: string[][];
  lockedAdditional?: string;
  lockedSkill?: string;
  byRarity: RarityMap;
  weapons: string[];
}

export interface AreaResult {
  areaName: string;
  groups: PatternGroup[];
}

export interface CalculationResult {
  wanted: WantedEffects;
  results: AreaResult[];
  error?: string;
}
