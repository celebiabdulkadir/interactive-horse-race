<template>
  <div class="race-scheduler">
    <div class="header">
      <h2>Race Schedule</h2>
      <button
        @click="generateSchedule"
        class="btn btn-primary"
        :disabled="horses.length === 0 || isRacing"
      >
        Generate Schedule
      </button>
    </div>

    <div v-if="!horses.length" class="warning">
      <p>⚠️ Please generate horses first before creating a race schedule!</p>
    </div>

    <div v-else-if="races.length > 0" class="schedule-container">
      <div class="schedule-info">
        <h3>6 Race Schedule Generated</h3>
        <p>Current Round: {{ currentRound }} / {{ totalRounds }}</p>
      </div>

      <div class="races-list">
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
            <h4>Round {{ race.round }}</h4>
            <span class="distance">{{ race.distance }}m</span>
            <span class="status" :class="race.status">{{ race.status }}</span>
          </div>

          <div class="race-horses">
            <div class="horses-preview">
              <span
                v-for="horse in race.horses.slice(0, 5)"
                :key="horse.id"
                class="horse-dot"
                :style="{ backgroundColor: horse.color }"
              ></span>
              <span v-if="race.horses.length > 5" class="more-horses">
                +{{ race.horses.length - 5 }}
              </span>
            </div>
          </div>

          <div v-if="race.results.length > 0" class="race-results">
            <h5>Results:</h5>
            <ol class="results-list">
              <li
                v-for="result in race.results.slice(0, 3)"
                :key="result.position"
                class="result-item"
              >
                <span class="horse-color" :style="{ backgroundColor: result.horse.color }"></span>
                {{ result.horse.name }} - {{ result.time.toFixed(2) }}s
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-schedule">
      <p>No race schedule generated yet. Click "Generate Schedule" to create 6 races!</p>
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
const isRacing = computed(() => store.getters['races/isRacing'])

const generateSchedule = () => {
  try {
    store.dispatch('races/generateRaceSchedule')
  } catch (error) {
    console.error('Error generating schedule:', error)
  }
}
</script>

<style scoped>
.race-scheduler {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #27ae60;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #219a52;
}

.btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ffeaa7;
}

.warning p {
  margin: 0;
}

.schedule-info {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.schedule-info h3 {
  margin: 0 0 5px 0;
  color: #27ae60;
}

.schedule-info p {
  margin: 0;
  color: #7f8c8d;
}

.races-list {
  display: grid;
  gap: 15px;
}

.race-item {
  background: white;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s;
}

.race-item.current {
  border-color: #3498db;
  background-color: #ebf3fd;
}

.race-item.running {
  border-color: #f39c12;
  background-color: #fef9e7;
}

.race-item.finished {
  border-color: #27ae60;
  background-color: #eafaf1;
}

.race-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.race-header h4 {
  margin: 0;
  color: #2c3e50;
}

.distance {
  font-weight: bold;
  color: #7f8c8d;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status.pending {
  background-color: #ecf0f1;
  color: #7f8c8d;
}

.status.running {
  background-color: #f39c12;
  color: white;
}

.status.finished {
  background-color: #27ae60;
  color: white;
}

.horses-preview {
  display: flex;
  align-items: center;
  gap: 5px;
}

.horse-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.more-horses {
  font-size: 12px;
  color: #7f8c8d;
  margin-left: 5px;
}

.race-results {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
}

.race-results h5 {
  margin: 0 0 10px 0;
  color: #27ae60;
}

.results-list {
  margin: 0;
  padding-left: 20px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.horse-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.no-schedule {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.no-schedule p {
  margin: 0;
  font-size: 16px;
}
</style>
