<script setup lang="ts">
import { watch, ref } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import Countdown from './Countdown.vue'
import ResultModal from './ResultModal.vue'
import HorseListItems from './HorseListItems.vue'
import { useSounds } from '../composables/useSounds'
const store = useStore()
const showResultModal = ref(false)
const currentRace = computed(() => store.getters['races/currentRace'])
const canStartRace = computed(() => store.getters['races/canStartRace'])
const canMoveToNextRound = computed(() => store.getters['races/canMoveToNextRound'])
const isAllRacesFinished = computed(() => store.getters['races/isAllRacesFinished'])
const isRacing = computed(() => store.getters['races/isRacing'])
const isScheduleGenerated = computed(() => store.getters['races/isScheduleGenerated'])
const currentRaceStatus = computed(() => currentRace.value?.status)

const { playCountdownBeep, playStartSound, playFinishSound } = useSounds()

const countdown = ref(0)
const countdownActive = ref(false)

const startRace = async () => {
  if (isRacing.value || countdownActive.value) return
  countdown.value = 3 // 3-second countdown
  countdownActive.value = true
  playCountdownBeep() // Play initial beep

  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value > 0) {
      playCountdownBeep() // Play beep for each tick
    }
    if (countdown.value === 0) {
      clearInterval(interval)
      playStartSound() // Play start sound
      countdownActive.value = false
      actuallyStartRace()
    }
  }, 1000)
}

const actuallyStartRace = async () => {
  try {
    await store.dispatch('races/startCurrentRace')
  } catch (error) {
    console.error('Failed to start race:', error)
  }
}

const nextRound = () => {
  store.dispatch('races/nextRound')
  store.dispatch('horses/resetPositions', null)
}

const resetAll = () => {
  store.dispatch('races/resetAll')
}

const closeResultModal = () => {
  showResultModal.value = false
}

watch(currentRaceStatus, () => {
  if (currentRaceStatus.value === 'finished') {
    playFinishSound()
    showResultModal.value = true
  }
})
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
        <button
          @click="startRace"
          class="btn btn-race"
          :disabled="!canStartRace || countdownActive"
        >
          {{ isRacing ? 'Racing...' : countdownActive ? countdown : 'Start Race' }}
        </button>

        <button v-if="canMoveToNextRound" @click="nextRound" class="btn btn-next">
          Next Round
        </button>

        <button v-if="isAllRacesFinished" @click="resetAll" class="btn btn-reset">Reset All</button>
      </div>
    </div>

    <Countdown :countdown="countdown" :countdownActive="countdownActive" />

    <HorseListItems v-if="currentRace" />

    <div v-if="!currentRace" class="no-race">
      <div class="empty-state">
        <div class="empty-icon">🏁</div>
        <h3 v-if="!isScheduleGenerated">Readty to Race!</h3>
        <h3 v-else-if="isAllRacesFinished">🎉 All Races Completed!</h3>
        <h3 v-else>Select a Race</h3>
        <p v-if="!isScheduleGenerated">Generate horses and schedule to start racing</p>
        <p v-else-if="isAllRacesFinished">Check the results below for winners and statistics</p>
        <p v-else>Click "Start Race" to begin the current round</p>
      </div>
    </div>

    <ResultModal
      :showResultModal="showResultModal"
      :results="currentRace?.results || []"
      @close="closeResultModal"
      :distance="currentRace?.distance"
      :roundNumber="currentRace?.round"
    />
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
  padding: 6px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Prevent header from shrinking */
}

.race-info h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1em;
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
  font-size: 12px;
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

@media (max-width: 768px) {
  .track-header {
    padding: 4px;
    margin-bottom: 5px;
  }
}

:root {
  --num-horses: 10;
}
</style>
