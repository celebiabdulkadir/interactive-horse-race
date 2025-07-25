<script setup lang="ts">
import { computed, watch, onUnmounted, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import HorseGenerator from './components/HorseGenerator.vue'
import RaceScheduler from './components/RaceScheduler.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResult from './components/RaceResult.vue'

const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
const isRacing = computed(() => store.getters['races/isRacing'])

// Responsive window width tracking
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 968)

// Tab system for mobile
const activeTab = ref('horses')

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isRacing.value) {
    event.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

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
  window.removeEventListener('resize', handleResize)
})

const generateHorses = () => {
  store.dispatch('horses/generateHorses')
  store.dispatch('races/resetAll')
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
      <!-- Desktop Layout -->
      <aside class="sidebar horses-sidebar" v-if="!isMobile">
        <HorseGenerator />
      </aside>

      <section class="main-content">
        <RaceTrack />
      </section>

      <aside class="right-sidebar" v-if="!isMobile">
        <div class="schedule-sidebar">
          <RaceScheduler />
        </div>
        <section class="results-section">
          <RaceResult />
        </section>
      </aside>

      <!-- Mobile Tab Layout -->
      <div v-if="isMobile" class="mobile-tabs">
        <div class="tab-navigation">
          <button
            @click="activeTab = 'horses'"
            :class="['tab-button', { active: activeTab === 'horses' }]"
          >
            🐎 Horses
          </button>
          <button
            @click="activeTab = 'schedule'"
            :class="['tab-button', { active: activeTab === 'schedule' }]"
          >
            📅 Schedule
          </button>
          <button
            @click="activeTab = 'results'"
            :class="['tab-button', { active: activeTab === 'results' }]"
          >
            🏆 Results
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'horses'" class="tab-panel">
            <HorseGenerator />
          </div>
          <div v-if="activeTab === 'schedule'" class="tab-panel">
            <RaceScheduler />
          </div>
          <div v-if="activeTab === 'results'" class="tab-panel">
            <RaceResult />
          </div>
        </div>
      </div>
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
  grid-template-columns: 0.7fr 2.3fr 2fr;
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
  flex-direction: row;
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
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'main'
      'mobile-tabs';
  }

  .main-content {
    min-height: 60vh;
  }

  .app-header {
    flex-direction: column;
    gap: 10px;
  }

  .app-header h1 {
    font-size: 1.5em;
  }

  /* Mobile Tab Styles */
  .mobile-tabs {
    grid-area: mobile-tabs;
    background: white;
    border-top: 1px solid #e1e8ed;
    height: 40vh;
    display: flex;
    flex-direction: column;
  }

  .tab-navigation {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e1e8ed;
  }

  .tab-button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: #6c757d;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
  }

  .tab-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #495057;
  }

  .tab-button.active {
    color: #667eea;
    background: white;
    border-bottom-color: #667eea;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
  }

  .tab-panel {
    height: 100%;
    padding: 0;
  }

  /* Hide desktop layout on mobile */
  .sidebar,
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .mobile-tabs {
    height: 35vh;
  }

  .tab-button {
    padding: 10px 12px;
    font-size: 13px;
  }

  .main-content {
    min-height: 55vh;
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
