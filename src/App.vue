<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import HorseGenerator from './components/HorseGenerator.vue'
import RaceScheduler from './components/RaceScheduler.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResult from './components/RaceResult.vue'

const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
const isRacing = computed(() => store.getters['races/isRacing'])

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isRacing.value) {
    event.preventDefault()
  }
}

watch(isRacing, (racing) => {
  if (racing) {
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.title = 'Racing... - Horse Racing Game'
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.title = 'Horse Racing Game'
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const generateHorses = () => {
  store.dispatch('horses/generateHorses')
}

const generateSchedule = () => {
  try {
    store.dispatch('races/generateRaceSchedule')
  } catch (error) {
    console.error('Error generating schedule:', error)
  }
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h3>🐎 Horse Racing Game</h3>
      <div class="header-controls">
        <button @click="generateHorses" class="btn btn-primary" :disabled="isRacing">
          Generate Horses
        </button>
        <button
          @click="generateSchedule"
          class="btn btn-success"
          :disabled="horses.length === 0 || isRacing"
        >
          Generate Schedule
        </button>

        <div v-if="isRacing" class="race-status-indicator">
          <div class="pulse-dot"></div>
          <span>Race in Progress</span>
        </div>
      </div>
    </header>

    <main class="dashboard">
      <aside class="sidebar horses-sidebar">
        <HorseGenerator />
      </aside>

      <section class="main-content">
        <RaceTrack />
      </section>

      <aside class="right-sidebar">
        <div class="schedule-sidebar">
          <RaceScheduler />
        </div>
        <section class="results-section">
          <RaceResult />
        </section>
      </aside>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f6fa;
  overflow-x: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.app-header h1 {
  font-size: 1.8em;
  font-weight: 700;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.btn-success {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.btn-success:hover:not(:disabled) {
  background: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dashboard {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'horses main right-sidebar';
  gap: 0;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.sidebar {
  background: white;
  border-right: 1px solid #e1e8ed;
  overflow-y: auto;
}

.horses-sidebar {
  grid-area: horses;
  border-left: none;
  min-width: 180px;
}

.right-sidebar {
  grid-area: right-sidebar;
  border-left: 1px solid #e1e8ed;
  border-right: none;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.schedule-sidebar {
  flex: 1;
  border-bottom: 1px solid #e1e8ed;
  overflow-y: auto;
  min-height: 0;
}

.main-content {
  grid-area: main;
  background: #f8f9fa;
  overflow-y: auto;
}

.results-section {
  flex: 1;
  background: white;
  overflow-y: auto;
  min-height: 0;
}

@media (max-width: 1400px) {
  .dashboard {
    grid-template-columns: 0.9fr 3fr 0.9fr;
  }
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 0.8fr 3fr 0.8fr;
  }
}

@media (max-width: 968px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      'main'
      'right-sidebar'
      'horses';
  }

  .right-sidebar {
    flex-direction: row;
    border-left: none;
    border-bottom: 1px solid #e1e8ed;
    height: auto;
    min-height: 200px;
  }

  .schedule-sidebar {
    flex: 1;
    border-bottom: none;
    border-right: 1px solid #e1e8ed;
    min-height: 200px;
  }

  .results-section {
    flex: 1;
    min-height: 200px;
  }

  .sidebar {
    height: auto;
    max-height: 200px;
  }

  .main-content {
    min-height: 50vh;
  }

  .horses-sidebar {
    border-right: none;
    border-bottom: 1px solid #e1e8ed;
    height: 12vh;
    min-height: 100px;
    max-height: 180px;
  }

  .app-header {
    flex-direction: column;
    gap: 10px;
  }

  .app-header h1 {
    font-size: 1.5em;
  }
}

@media (max-width: 768px) {
  .right-sidebar {
    flex-direction: column;
  }

  .schedule-sidebar {
    border-right: none;
    border-bottom: 1px solid #e1e8ed;
    min-height: 150px;
  }

  .results-section {
    min-height: 150px;
  }
}

@media (min-width: 1920px) {
  .dashboard {
    grid-template-columns: 1fr 4fr 1fr;
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

.race-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: pulse-red 1.5s ease-in-out infinite;
}

@keyframes pulse-red {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
