export interface Horse {
  id: number
  name: string
  color: string
  condition: number // 1-100
  position: number // For animation
  speed: number // Calculated based on condition
}

export interface Race {
  id: number
  round: number
  distance: number // in meters
  horses: Horse[]
  results: RaceResult[]
  status: 'pending' | 'running' | 'finished'
  winner?: Horse
}

export interface RaceResult {
  position: number
  horse: Horse
  time: number // in seconds
}

export interface RaceSchedule {
  races: Race[]
  currentRound: number
  totalRounds: number
}

export const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]
export const HORSE_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F06292',
  '#AED581',
  '#FFD54F',
  '#FF8A65',
  '#BA68C8',
  '#64B5F6',
  '#4DB6AC',
  '#81C784',
  '#FFB74D',
  '#F48FB1',
  '#9575CD',
  '#7986CB',
  '#A1887F',
]

export interface RootState {
  horses: import('./modules/horses').HorsesState
  races: import('./modules/races').RacesState
}
