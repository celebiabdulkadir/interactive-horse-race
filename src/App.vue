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

// Simple race protection
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isRacing.value) {
    event.preventDefault()
  }
}

// Watch for race status changes
watch(isRacing, (racing) => {
  if (racing) {
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.title = 'Racing... - Horse Racing Game'
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.title = 'Horse Racing Game'
  }
})

// Cleanup
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
      <h3>🐎 Interactive Horse Racing Game</h3>
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

        <!-- Race Status Indicator -->
        <div v-if="isRacing" class="race-status-indicator">
          <div class="pulse-dot"></div>
          <span>Race in Progress</span>
        </div>
      </div>
    </header>

    <main class="dashboard">
      <!-- Left Sidebar - Horses -->
      <aside class="sidebar horses-sidebar">
        <HorseGenerator />
      </aside>

      <!-- Main Content - Race Track -->
      <section class="main-content">
        <RaceTrack />
      </section>

      <!-- Right Sidebar - Race Schedule -->
      <aside class="sidebar schedule-sidebar">
        <RaceScheduler />
      </aside>

      <!-- Bottom Section - Results -->
      <section class="results-section">
        <RaceResult />
      </section>
    </main>
  </div>
</template>

<style>
/* Global Styles */
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
  font-size: 14px;
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
  /* Use proportional units instead of fixed pixels */
  grid-template-columns: 1fr 3fr 1fr; /* Horses: Main: Schedule = 1:3:0.8 ratio */
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'horses main schedule'
    'results results results';
  gap: 0;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.sidebar {
  background: white;
  border-right: 1px solid #e1e8ed;
  overflow-y: auto;
}

/* Add min/max constraints for better control */
.horses-sidebar {
  grid-area: horses;
  border-left: none;
  min-width: 180px; /* Minimum width */
}

.schedule-sidebar {
  grid-area: schedule;
  border-left: 1px solid #e1e8ed;
  border-right: none;
  min-width: 160px; /* Minimum width */
}

.main-content {
  grid-area: main;
  background: #f8f9fa;
  overflow-y: auto;
}

.results-section {
  grid-area: results;
  background: white;
  border-top: 1px solid #e1e8ed;
  height: 15vh; /* 15% of viewport height instead of fixed pixels */
  min-height: 150px; /* Minimum height */
  max-height: 250px; /* Maximum height */
  overflow-y: auto;
}

/* Responsive breakpoints with proportional units */
@media (max-width: 1400px) {
  .dashboard {
    grid-template-columns: 0.9fr 3fr 0.9fr; /* Slightly smaller sidebars */
  }
}

@media (max-width: 1200px) {
  .dashboard {
    grid-template-columns: 0.8fr 3fr 0.8fr; /* Even smaller sidebars */
  }
}

@media (max-width: 968px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      'horses'
      'schedule'
      'main'
      'results';
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid #e1e8ed;
    height: 12vh; /* 12% of viewport height */
    min-height: 100px;
    max-height: 180px;
  }

  .results-section {
    height: 20vh; /* 20% on mobile */
    min-height: 120px;
    max-height: 200px;
  }

  .app-header {
    flex-direction: column;
    gap: 10px;
  }

  .app-header h1 {
    font-size: 1.5em;
  }
}

/* Extra large screens (4K, ultrawide monitors) */
@media (min-width: 1920px) {
  .dashboard {
    grid-template-columns: 1fr 4fr 1fr; /* Even more space for race track */
  }
}

/* Custom Scrollbar */
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

/* NEW: Race Status Indicator */
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
