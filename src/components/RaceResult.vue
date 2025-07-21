<template>
  <div class="race-results">
    <div class="header">
      <h2>Race Results</h2>
      <div v-if="allResults.length > 0" class="results-summary">
        {{ allResults.length }} / {{ totalRounds }} races completed
      </div>
    </div>

    <div v-if="allResults.length > 0" class="results-container">
      <div v-for="(results, raceIndex) in allResults" :key="raceIndex" class="race-result">
        <div class="result-header">
          <h3>Round {{ raceIndex + 1 }} Results</h3>
          <span class="distance">{{ getRaceDistance(raceIndex) }}m</span>
        </div>

        <div class="podium">
          <div
            v-for="result in results.slice(0, 3)"
            :key="result.position"
            class="podium-position"
            :class="`position-${result.position}`"
          >
            <div class="medal">{{ getMedal(result.position) }}</div>
            <div class="horse-avatar" :style="{ backgroundColor: result.horse.color }">🐎</div>
            <div class="horse-info">
              <div class="horse-name">{{ result.horse.name }}</div>
              <div class="horse-time">{{ result.time.toFixed(2) }}s</div>
              <div class="horse-condition">Condition: {{ result.horse.condition }}</div>
            </div>
          </div>
        </div>

        <div class="full-results">
          <h4>Full Results:</h4>
          <div class="results-table">
            <div class="table-header">
              <span>Pos</span>
              <span>Horse</span>
              <span>Time</span>
              <span>Condition</span>
            </div>
            <div
              v-for="result in results"
              :key="result.position"
              class="table-row"
              :class="{ 'top-three': result.position <= 3 }"
            >
              <span class="position">{{ result.position }}</span>
              <span class="horse-cell">
                <span
                  class="horse-color-dot"
                  :style="{ backgroundColor: result.horse.color }"
                ></span>
                {{ result.horse.name }}
              </span>
              <span class="time">{{ result.time.toFixed(2) }}s</span>
              <span class="condition">{{ result.horse.condition }}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <div class="empty-state">
        <div class="empty-icon">🏆</div>
        <h3>No Race Results Yet</h3>
        <p>Complete some races to see results here!</p>
      </div>
    </div>

    <!-- Overall Statistics -->
    <div v-if="allResults.length > 0" class="statistics">
      <h3>Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ allResults.length }}</div>
          <div class="stat-label">Races Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ getWinningHorses().length }}</div>
          <div class="stat-label">Different Winners</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ getMostSuccessfulHorse()?.wins || 0 }}</div>
          <div class="stat-label">Most Wins</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ getAverageTime() }}s</div>
          <div class="stat-label">Avg. Winner Time</div>
        </div>
      </div>

      <div v-if="getMostSuccessfulHorse()" class="champion">
        <h4>🏆 Current Champion</h4>
        <div class="champion-card">
          <div
            class="champion-avatar"
            :style="{ backgroundColor: getMostSuccessfulHorse()?.horse?.color }"
          >
            🐎
          </div>
          <div class="champion-info">
            <div class="champion-name">{{ getMostSuccessfulHorse()?.horse?.name }}</div>
            <div class="champion-stats">
              {{ getMostSuccessfulHorse()?.wins }} wins out of {{ allResults.length }} races
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { RACE_DISTANCES } from '../store/types'
import type { Horse, RaceResult } from '../store/types'

const store = useStore()

const allResults = computed(() => store.getters['races/allResults'])
const totalRounds = computed(() => store.getters['races/totalRounds'])

const getRaceDistance = (raceIndex: number): number => {
  return RACE_DISTANCES[raceIndex] || 0
}

const getMedal = (position: number): string => {
  switch (position) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return ''
  }
}

const getWinningHorses = (): Horse[] => {
  const winners = allResults.value.map((results: RaceResult[]) => results[0]?.horse).filter(Boolean)
  return [...new Set(winners.map((horse: Horse) => horse.id))].map((id) =>
    winners.find((horse: Horse) => horse.id === id),
  )
}

const getMostSuccessfulHorse = (): { horse: Horse; wins: number } | null => {
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
  const average =
    winnerTimes.reduce((sum: number, time: number) => sum + time, 0) / winnerTimes.length

  return average.toFixed(2)
}
</script>

<style scoped>
.race-results {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #2c3e50;
}

.results-summary {
  background: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.results-container {
  display: grid;
  gap: 20px;
}

.race-result {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
}

.result-header h3 {
  margin: 0;
  color: #2c3e50;
}

.distance {
  background: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.podium {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.podium-position {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  position: relative;
}

.position-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: 2px solid #f1c40f;
}

.position-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  border: 2px solid #95a5a6;
}

.position-3 {
  background: linear-gradient(135deg, #cd7f32, #d4a574);
  border: 2px solid #d35400;
}

.medal {
  font-size: 24px;
  margin-bottom: 10px;
}

.horse-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 10px auto;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.horse-info {
  color: #2c3e50;
}

.horse-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.horse-time {
  font-size: 14px;
  font-weight: bold;
  color: #e74c3c;
}

.horse-condition {
  font-size: 12px;
  color: #7f8c8d;
}

.full-results {
  margin-top: 20px;
}

.full-results h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.results-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ecf0f1;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px;
  background: #34495e;
  color: white;
  font-weight: bold;
  padding: 12px;
  gap: 15px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 100px;
  padding: 10px 12px;
  gap: 15px;
  border-bottom: 1px solid #ecf0f1;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.top-three {
  background-color: #f8f9fa;
  font-weight: bold;
}

.position {
  text-align: center;
  font-weight: bold;
}

.horse-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.horse-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.time {
  text-align: center;
  font-weight: bold;
  color: #e74c3c;
}

.condition {
  text-align: center;
  color: #7f8c8d;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.empty-state p {
  margin: 0;
}

.statistics {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}

.statistics h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #ecf0f1;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: bold;
}

.champion {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
}

.champion h4 {
  margin: 0 0 15px 0;
  color: #f39c12;
}

.champion-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #f1c40f;
}

.champion-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.champion-info {
  text-align: left;
}

.champion-name {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.champion-stats {
  font-size: 14px;
  color: #7f8c8d;
}
</style>
