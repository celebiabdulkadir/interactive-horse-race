<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { RACE_DISTANCES, type Horse, type RaceResult } from '../store/types'
import RaceResultCard from './RaceResultCard.vue'
const store = useStore()

const allResults = computed(() => store.getters['races/allResults'])
const totalRounds = computed(() => store.getters['races/totalRounds'])
const currentRace = computed(() => store.getters['races/currentRace'])
const isRacing = computed(() => store.getters['races/isRacing'])

// FIXED: Force reactive updates
const isShowingResults = computed(() => {
  const result = store.getters['races/isShowingResults']
  return result
})

const liveResults = computed(() => {
  const results = store.getters['races/currentRaceResults']
  return results
})

const shouldShowLiveResults = computed(() => {
  const should = isShowingResults.value && liveResults.value.length > 0
  return should
})

const currentRaceResults = computed(() => {
  if (!currentRace.value || !isRacing.value) return null
  return currentRace.value.results || []
})

const getRaceDistance = (raceIndex: number): number => {
  return RACE_DISTANCES[raceIndex] || 0
}

const getWinningHorses = () => {
  const winners = allResults.value.map((results: RaceResult[]) => results[0]?.horse).filter(Boolean)
  return [...new Set(winners.map((horse: Horse) => horse.id))].map((id) =>
    winners.find((horse: Horse) => horse.id === id),
  )
}

const getMostSuccessfulHorse = () => {
  if (allResults.value.length === 0) return null

  const horseWins: { [key: number]: { horse: Horse; wins: number } } = {}

  allResults.value.forEach((results: RaceResult[]) => {
    const winner = results[0]?.horse
    if (winner) {
      if (!horseWins[winner.id]) {
        horseWins[winner.id] = { horse: winner, wins: 0 }
      }
      horseWins[winner.id].wins++
    }
  })

  return Object.values(horseWins).reduce(
    (best: { horse: Horse; wins: number } | null, current: { horse: Horse; wins: number }) =>
      current.wins > (best?.wins || 0) ? current : best,
    null,
  )
}

const getAverageTime = (): string => {
  if (allResults.value.length === 0) return '0.00'

  const winnerTimes = allResults.value
    .map((results: RaceResult[]) => results[0]?.time)
    .filter(Boolean)

  if (winnerTimes.length === 0) return '0.00'

  const average =
    winnerTimes.reduce((sum: number, time: number) => sum + time, 0) / winnerTimes.length

  return average.toFixed(2)
}
</script>
<template>
  <div class="race-results">
    <div class="results-header">
      <h3>🏆 Race Results</h3>
      <div v-if="allResults.length > 0" class="results-count">
        {{ allResults.length }}/{{ totalRounds }} completed
      </div>
    </div>
    <div v-if="allResults.length > 0" class="results-container">
      <div class="results-grid" :class="{ 'with-live': isRacing && currentRaceResults }">
        <div v-for="(results, raceIndex) in allResults" :key="raceIndex" class="race-result-card">
          <RaceResultCard
            :key="raceIndex"
            :results="results"
            :roundNumber="raceIndex + 1"
            :distance="getRaceDistance(raceIndex)"
          />
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat">
          <span class="stat-value">{{ getWinningHorses().length }}</span>
          <span class="stat-label">Different Winners</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ getMostSuccessfulHorse()?.wins || 0 }}</span>
          <span class="stat-label">Most Wins</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ getAverageTime() }}s</span>
          <span class="stat-label">Avg Winner Time</span>
        </div>
        <div v-if="getMostSuccessfulHorse()" class="champion-mini">
          <div
            class="champion-color"
            :style="{ backgroundColor: getMostSuccessfulHorse()?.horse.color }"
          ></div>
          <div class="champion-info-mini">
            <div class="champion-name-mini">{{ getMostSuccessfulHorse()?.horse.name }}</div>
            <div class="champion-wins">{{ getMostSuccessfulHorse()?.wins }} wins</div>
          </div>
          <div class="champion-crown">👑</div>
        </div>
      </div>
    </div>

    <div v-else-if="!shouldShowLiveResults" class="no-results">
      <span class="empty-icon">🏁</span>
      <span>Race results will appear here after completing races</span>
    </div>
  </div>
</template>

<style scoped>
.race-results {
  padding: 20px;
  height: 100%;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.results-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.results-count {
  background: #27ae60;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.results-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.results-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  max-height: 240px;
  overflow-y: auto;
}

.race-result-card {
  background: #fafbfc;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s;
}

.race-result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.round-badge {
  background: #3498db;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.distance {
  font-size: 11px;
  color: #7f8c8d;
  font-weight: 600;
}

.podium-mini {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.podium-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.position-medal {
  font-size: 14px;
}

.horse-mini {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.horse-name-mini {
  font-size: 11px;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-mini {
  font-size: 10px;
  color: #e74c3c;
  font-weight: 600;
}

.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e1e8ed;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #3498db;
}

.stat-label {
  font-size: 10px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
}

.champion-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border-radius: 8px;
  color: white;
}

.champion-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.champion-info-mini {
  flex: 1;
  min-width: 0;
}

.champion-name-mini {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.champion-wins {
  font-size: 10px;
  opacity: 0.9;
}

.champion-crown {
  font-size: 16px;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100px;
  color: #7f8c8d;
  font-size: 14px;
}

.empty-icon {
  font-size: 24px;
}

/* NEW: Expandable results for all horses */
.all-results {
  margin-top: 10px;
  border-top: 1px solid #e1e8ed;
  padding-top: 8px;
}

.show-all {
  cursor: pointer;
  font-size: 11px;
  color: #3498db;
  font-weight: 600;
  user-select: none;
}

.show-all:hover {
  color: #2980b9;
}

.full-results-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  font-size: 10px;
}

.position-num {
  width: 16px;
  text-align: center;
  font-weight: 600;
  color: #7f8c8d;
}

.horse-name-small {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.time-small {
  font-weight: 600;
  color: #e74c3c;
}

/* NEW: Live Results Styles */
.live-results {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  animation: liveGlow 2s ease-in-out infinite alternate;
}

@keyframes liveGlow {
  from {
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }
  to {
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
  }
}

.live-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.live-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.live-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.live-podium {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.live-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.live-result-item.position-1 {
  background: rgba(255, 215, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.8);
}

.live-result-item.position-2 {
  background: rgba(192, 192, 192, 0.3);
  border: 2px solid rgba(192, 192, 192, 0.8);
}

.live-result-item.position-3 {
  background: rgba(205, 127, 50, 0.3);
  border: 2px solid rgba(205, 127, 50, 0.8);
}

.live-position {
  width: 30px;
  height: 30px;
  background: white;
  color: #2c3e50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.live-horse-info {
  flex: 1;
}

.horse-name-live {
  font-weight: 600;
  font-size: 14px;
}

.time-live {
  font-size: 12px;
  opacity: 0.9;
}

.winner-crown {
  font-size: 20px;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.results-grid.with-live {
  margin-top: 0;
}
</style>
