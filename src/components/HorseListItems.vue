<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import HorseRace from './HorseRace.vue'

const store = useStore()

const currentRace = computed(() => store.getters['races/currentRace'])
const isRacing = computed(() => store.getters['races/isRacing'])
const numHorses = computed(() => currentRace.value?.horses.length || 10)

onMounted(() => {
  document.documentElement.style.setProperty('--num-horses', numHorses.value)
})
watch(numHorses, (val) => {
  document.documentElement.style.setProperty('--num-horses', val)
})
const laneHeightPx = computed(() => {
  if (!currentRace.value) return 0
  // Use the same logic as getTrackHeight, but in px
  const numberOfHorses = currentRace.value.horses.length
  // Calculate the track height in vh (as a number)
  const baseHeight = Math.max(60, Math.min(80, 60 + (numberOfHorses - 5) * 2))
  // Convert vh to px
  const vh = window.innerHeight / 100
  const trackHeightPx = baseHeight * vh
  return trackHeightPx / numberOfHorses
})

// Calculate responsive track height based on viewport
const getTrackHeight = () => {
  if (!currentRace.value) return '60vh'
  const numberOfHorses = currentRace.value.horses.length
  // Use viewport height: 60vh minimum, scales up on larger screens
  const baseHeight = Math.max(60, Math.min(80, 60 + (numberOfHorses - 5) * 2))
  return `${baseHeight}vh`
}
</script>

<template>
  <div v-if="currentRace" class="track-container" :style="{ height: getTrackHeight() }">
    <div class="track">
      <div class="finish-line"></div>
      <div class="lanes-container">
        <div
          v-for="(horse, index) in currentRace.horses"
          :key="horse.id"
          class="lane"
          :style="{
            '--horse-progress': Math.min(95, (horse.position / currentRace.distance) * 95),
            '--horse-color': horse.color,
            '--lane-height': laneHeightPx + 'px',
          }"
        >
          <div class="lane-info">
            <div class="lane-number">{{ index + 1 }}</div>
            <div class="horse-details">
              <span class="horse-name">{{ horse.name }}</span>
            </div>
          </div>
          <div
            class="horse"
            :class="{ running: isRacing && currentRace.status === 'running' }"
            :style="{
              left: `calc(${Math.min(95, (horse.position / currentRace.distance) * 95)}%)`,
            }"
          >
            <HorseRace :horse="horse.color" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.track-container {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 0;
  box-sizing: border-box;
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.track {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #27ae60 0%,
    #2ecc71 30%,
    #2ecc71 90%,
    #f1c40f 95%,
    #f39c12 100%
  );
  border-radius: 8px;
  border: 3px solid #27ae60;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.lanes-container {
  display: grid;
  grid-template-rows: repeat(var(--num-horses, 10), 1fr);
  height: 100%;
  width: 100%;
  position: relative;
}

.lane {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
  min-height: 0;
  box-sizing: border-box;
  padding-left: 40px;
  height: 100%;
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
}

.horse {
  position: absolute;
  left: calc(var(--horse-progress) * 1%);
  width: calc(var(--lane-height) * 0.7);
  height: calc(var(--lane-height) * 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  transform: translateZ(0);
  will-change: left;
  font-size: 1.5em;
  background: none;
  border: none;
}

.horse.running {
  animation: gallop 1s ease-in-out infinite;
}

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

@media (max-width: 768px) {
  .track-container {
    height: 50vh !important;
  }
  .horse {
    transform: scale(0.7);
  }

  .horse.running {
    animation: gallop-mobile 1s ease-in-out infinite;
  }

  .horse.finished {
    animation: celebrate-mobile 1s ease-out;
  }

  .horse-name {
    font-size: 10px;
    padding: 2px 4px;
  }
  .lane-number {
    width: 18px;
    height: 18px;
    font-size: 9px;
  }
}

@keyframes gallop-mobile {
  0%,
  100% {
    transform: translateZ(0) scale(0.7);
  }
  50% {
    transform: translateZ(0) scale(0.75) translateY(-2px);
  }
}

@keyframes celebrate-mobile {
  0% {
    transform: translateZ(0) scale(0.7);
  }
  50% {
    transform: translateZ(0) scale(0.85) rotate(10deg);
  }
  100% {
    transform: translateZ(0) scale(0.7) rotate(0deg);
  }
}
</style>
