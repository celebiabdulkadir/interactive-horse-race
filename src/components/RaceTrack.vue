<template>
  <div class="race-track">
    <div class="header">
      <h2>Race Track</h2>
      <div class="controls">
        <button @click="startRace" class="btn btn-success" :disabled="!canStartRace">
          {{ isRacing ? 'Racing...' : 'Start Race' }}
        </button>

        <button v-if="canMoveToNextRound" @click="nextRound" class="btn btn-primary">
          Next Round
        </button>

        <button v-if="isAllRacesFinished" @click="resetAll" class="btn btn-secondary">
          Reset All
        </button>
      </div>
    </div>

    <div v-if="currentRace" class="race-info">
      <h3>Round {{ currentRace.round }} - {{ currentRace.distance }}m</h3>
      <div class="race-status">
        <span class="status" :class="currentRace.status">
          {{ currentRace.status.toUpperCase() }}
        </span>
      </div>
    </div>

    <div v-if="currentRace" class="track-container">
      <div class="track">
        <div class="finish-line"></div>
        <div
          v-for="(horse, index) in currentRace.horses"
          :key="horse.id"
          class="lane"
          :style="{ top: `${index * 50 + 20}px` }"
        >
          <div class="lane-number">{{ index + 1 }}</div>
          <div
            class="horse"
            :style="{
              left: `${(horse.position / currentRace.distance) * 100}%`,
              backgroundColor: horse.color,
            }"
          >
            🐎
          </div>
          <div class="horse-name">{{ horse.name }}</div>
        </div>
      </div>
    </div>

    <div v-else class="no-race">
      <p v-if="!isScheduleGenerated">Please generate horses and a race schedule first!</p>
      <p v-else-if="isAllRacesFinished">🎉 All races completed! Check the results below.</p>
      <p v-else>Select a race to start!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const currentRace = computed(() => store.getters['races/currentRace'])
const canStartRace = computed(() => store.getters['races/canStartRace'])
const canMoveToNextRound = computed(() => store.getters['races/canMoveToNextRound'])
const isAllRacesFinished = computed(() => store.getters['races/isAllRacesFinished'])
const isRacing = computed(() => store.getters['races/isRacing'])
const isScheduleGenerated = computed(() => store.getters['races/isScheduleGenerated'])

const startRace = () => {
  store.dispatch('races/startCurrentRace')
}

const nextRound = () => {
  store.dispatch('races/nextRound')
}

const resetAll = () => {
  store.dispatch('races/resetAll')
}
</script>

<style scoped>
.race-track {
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

.controls {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #219a52;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}

.btn-secondary:hover {
  background-color: #6c757d;
}

.btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.race-info {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.race-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.race-status .status {
  padding: 5px 10px;
  border-radius: 15px;
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
  animation: pulse 1s infinite;
}

.status.finished {
  background-color: #27ae60;
  color: white;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.track-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
}

.track {
  position: relative;
  min-height: 520px;
  background: linear-gradient(90deg, #90ee90 0%, #90ee90 95%, #ffd700 95%, #ffd700 100%);
  border-radius: 8px;
  border: 2px solid #27ae60;
}

.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);
  z-index: 10;
}

.lane {
  position: absolute;
  width: 100%;
  height: 40px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
}

.lane-number {
  position: absolute;
  left: -30px;
  width: 25px;
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
  background: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}

.horse {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: left 0.1s linear;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.horse-name {
  position: absolute;
  left: 5px;
  font-size: 12px;
  font-weight: bold;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 10px;
  top: -20px;
}

.no-race {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  background: white;
  border-radius: 8px;
}

.no-race p {
  margin: 0;
  font-size: 16px;
}
</style>
