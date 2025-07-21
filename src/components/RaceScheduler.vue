<template>
  <div class="race-scheduler">
    <div class="header">
      <h3>📅 Race Schedule</h3>
      <div v-if="races.length > 0" class="round-indicator">
        {{ currentRound }}/{{ totalRounds }}
      </div>
    </div>

    <div v-if="!horses.length" class="warning">
      <small>⚠️ Generate horses first</small>
    </div>

    <div v-else-if="races.length > 0" class="schedule-container">
      <div
        v-for="race in races"
        :key="race.id"
        class="race-item"
        :class="{
          current: race.round === currentRound,
          finished: race.status === 'finished',
          running: race.status === 'running',
        }"
      >
        <div class="race-header">
          <div class="race-title">
            <span class="round">R{{ race.round }}</span>
            <span class="distance">{{ race.distance }}m</span>
          </div>
          <span class="status-dot" :class="race.status"></span>
        </div>

        <div class="race-horses">
          <div class="horses-preview">
            <span
              v-for="horse in race.horses.slice(0, 8)"
              :key="horse.id"
              class="horse-dot"
              :style="{ backgroundColor: horse.color }"
            ></span>
            <span v-if="race.horses.length > 8" class="more"> +{{ race.horses.length - 8 }} </span>
          </div>
        </div>

        <div v-if="race.results.length > 0" class="race-winner">
          <div class="winner-info">
            <span
              class="winner-color"
              :style="{ backgroundColor: race.results[0]?.horse.color }"
            ></span>
            <span class="winner-name">{{ race.results[0]?.horse.name }}</span>
            <span class="winner-time">{{ race.results[0]?.time.toFixed(2) }}s</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-schedule">
      <div class="empty-state">
        <div class="empty-icon">🏁</div>
        <p>No schedule</p>
        <small>Generate schedule to start racing</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
const races = computed(() => store.getters['races/allRaces'])
const currentRound = computed(() => store.getters['races/currentRound'])
const totalRounds = computed(() => store.getters['races/totalRounds'])
</script>

<style scoped>
.race-scheduler {
  padding: 20px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e8ed;
}

.header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.round-indicator {
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ffeaa7;
  text-align: center;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.race-item {
  background: #fafbfc;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s;
}

.race-item.current {
  border-color: #3498db;
  background: #ebf3fd;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
}

.race-item.running {
  border-color: #f39c12;
  background: #fef9e7;
  animation: pulse 2s infinite;
}

.race-item.finished {
  border-color: #27ae60;
  background: #eafaf1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.race-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.race-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.round {
  background: #34495e;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.distance {
  font-size: 12px;
  font-weight: 600;
  color: #7f8c8d;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.pending {
  background-color: #bdc3c7;
}

.status-dot.running {
  background-color: #f39c12;
  animation: blink 1s infinite;
}

.status-dot.finished {
  background-color: #27ae60;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

.horses-preview {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 8px;
}

.horse-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.more {
  font-size: 10px;
  color: #7f8c8d;
  margin-left: 4px;
}

.race-winner {
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.winner-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.winner-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.winner-name {
  flex: 1;
  font-size: 11px;
  font-weight: 600;
  color: #27ae60;
}

.winner-time {
  font-size: 10px;
  color: #7f8c8d;
  font-weight: 600;
}

.no-schedule {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state {
  text-align: center;
  color: #95a5a6;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-state p {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.empty-state small {
  font-size: 12px;
  opacity: 0.7;
}
</style>
