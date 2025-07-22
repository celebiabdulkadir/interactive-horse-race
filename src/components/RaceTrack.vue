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

// Calculate track height based on number of horses
const getTrackHeight = () => {
  if (!currentRace.value) return 400
  const numberOfHorses = currentRace.value.horses.length
  // 40px per lane + 15px top padding + 15px bottom padding
  return numberOfHorses * 40 + 30
}

const startRace = async () => {
  try {
    await store.dispatch('races/startCurrentRace')
  } catch (error) {
    console.error('Failed to start race:', error)
    // Show user-friendly error message
  }
}

const nextRound = () => {
  store.dispatch('races/nextRound')
  store.dispatch('horses/resetPositions', null)
}

const resetAll = () => {
  store.dispatch('races/resetAll')
}
</script>
<template>
  <div class="race-track">
    <div class="track-header">
      <div class="race-info">
        <h2 v-if="currentRace">Round {{ currentRace.round }} - {{ currentRace.distance }}m</h2>
        <h2 v-else>Race Track</h2>
        <div v-if="currentRace" class="race-status">
          <span class="status" :class="currentRace.status">
            {{ currentRace.status.toUpperCase() }}
          </span>
        </div>
      </div>

      <div class="controls">
        <button @click="startRace" class="btn btn-race" :disabled="!canStartRace">
          {{ isRacing ? 'Racing...' : 'Start Race' }}
        </button>

        <button v-if="canMoveToNextRound" @click="nextRound" class="btn btn-next">
          Next Round
        </button>

        <button v-if="isAllRacesFinished" @click="resetAll" class="btn btn-reset">Reset All</button>
      </div>
    </div>

    <div v-if="currentRace" class="track-container">
      <div class="track" :style="{ height: `${getTrackHeight()}px` }">
        <div class="finish-line"></div>
        <div
          v-for="(horse, index) in currentRace.horses"
          :key="horse.id"
          class="lane"
          :style="{ top: `${index * 40 + 15}px` }"
        >
          <div class="lane-info">
            <div class="lane-number">{{ index + 1 }}</div>
            <div class="horse-name">{{ horse.name }}</div>
          </div>
          <div
            class="horse"
            :class="{
              running: isRacing, // Keep running as long as race is active
              finished: horse.position >= currentRace.distance,
            }"
            :style="{
              '--horse-progress': Math.min(95, (horse.position / currentRace.distance) * 95),
              '--horse-color': horse.color,
            }"
          >
            🐎
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-race">
      <div class="empty-state">
        <div class="empty-icon">🏁</div>
        <h3 v-if="!isScheduleGenerated">Ready to Race!</h3>
        <h3 v-else-if="isAllRacesFinished">🎉 All Races Completed!</h3>
        <h3 v-else>Select a Race</h3>
        <p v-if="!isScheduleGenerated">Generate horses and schedule to start racing</p>
        <p v-else-if="isAllRacesFinished">Check the results below for winners and statistics</p>
        <p v-else>Click "Start Race" to begin the current round</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-track {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Prevent header from shrinking */
}

.race-info h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.5em;
}

.race-status .status {
  padding: 4px 12px;
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

.controls {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-race {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-race:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-next {
  background: #27ae60;
  color: white;
}

.btn-next:hover {
  background: #219a52;
}

.btn-reset {
  background: #7f8c8d;
  color: white;
}

.btn-reset:hover {
  background: #6c757d;
}

.btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* FIXED: Track container with proper scrolling */
.track-container {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Allow vertical scrolling if needed */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  min-height: 0; /* Allow flex item to shrink */
  box-sizing: border-box;
}

.track {
  position: relative;
  width: 100%;
  /* Height is now dynamic based on number of horses */
  min-height: 200px;
  background: linear-gradient(90deg, #2ecc71 0%, #27ae60 70%, #f1c40f 70%, #f39c12 100%);
  border-radius: 8px;
  border: 3px solid #27ae60;
  box-sizing: border-box;
}

.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: repeating-linear-gradient(45deg, #2c3e50, #2c3e50 8px, #ecf0f1 8px, #ecf0f1 16px);
  z-index: 10;
}

/* FIXED: Lane sizing and positioning */
.lane {
  position: absolute;
  width: 100%;
  height: 35px; /* Slightly smaller to fit more lanes */
  border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
}

.lane:last-child {
  border-bottom: none;
}

.lane-info {
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 5;
}

.lane-number {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 11px;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.horse-name {
  background: rgba(255, 255, 255, 0.95);
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  color: #2c3e50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* FIXED: Smooth horse movement without flickering */
.horse {
  position: absolute;
  left: calc(var(--horse-progress) * 1%);
  width: 28px; /* Slightly smaller */
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; /* Slightly smaller */
  z-index: 8;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
  background-color: var(--horse-color);

  /* REMOVED: All transitions that cause conflicts */
  transform: translateZ(0);
  will-change: left;
  /* NO transition on left property! */
}

/* Running animation */
.horse.running {
  animation: gallop 1s ease-in-out infinite;
}

/* Simplified animation to prevent jumpiness */
@keyframes gallop {
  0%,
  100% {
    transform: translateZ(0) scale(1);
  }
  50% {
    transform: translateZ(0) scale(1.05) translateY(-2px);
  }
}

.horse.finished {
  animation: celebrate 1s ease-out;
}

@keyframes celebrate {
  0% {
    transform: translateZ(0) scale(1);
  }
  50% {
    transform: translateZ(0) scale(1.2) rotate(10deg);
  }
  100% {
    transform: translateZ(0) scale(1) rotate(0deg);
  }
}

.no-race {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  font-size: 1.5em;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 968px) {
  .track-container {
    max-height: 350px; /* Limit height on mobile */
  }

  .lane {
    height: 30px; /* Even smaller on mobile */
  }

  .horse {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .horse-name {
    font-size: 9px;
    max-width: 80px;
  }
}
</style>
