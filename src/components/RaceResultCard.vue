<script lang="ts" setup>
import type { RaceResult } from '../store/types'
const props = defineProps<{
  results: RaceResult[]
  roundNumber?: number
  distance?: number
}>()

function getMedal(position: number) {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return ''
}
</script>

<template>
  <div class="card-header">
    <span class="round-badge" v-if="roundNumber">R{{ roundNumber }}</span>
    <span class="distance" v-if="distance">{{ distance }}m</span>
  </div>

  <div class="podium-mini">
    <div v-for="result in props.results.slice(0, 3)" :key="result.position" class="podium-item">
      <div class="position-medal">{{ getMedal(result.position) }}</div>
      <div class="horse-mini" :style="{ backgroundColor: result.horse.color }"></div>
      <div class="result-info">
        <div class="horse-name-mini">{{ result.horse.name }}</div>
        <div class="time-mini">{{ result.time.toFixed(2) }}s</div>
      </div>
    </div>
  </div>

  <details class="all-results" v-if="props.results.length > 3">
    <summary class="show-all">Show all {{ props.results.length }} horses</summary>
    <div class="full-results-list">
      <div v-for="result in props.results.slice(3)" :key="result.position" class="result-row">
        <span class="position-num">{{ result.position }}</span>
        <div class="horse-mini" :style="{ backgroundColor: result.horse.color }"></div>
        <span class="horse-name-small">{{ result.horse.name }}</span>
        <span class="time-small">{{ result.time.toFixed(2) }}s</span>
      </div>
    </div>
  </details>
</template>
<style scoped>
.race-result-card {
  background: #fafbfc;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s;
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
</style>
