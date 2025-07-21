<script setup lang="ts">
import HorseGenerator from './components/HorseGenerator.vue'
import RaceScheduler from './components/RaceScheduler.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResult from './components/RaceResult.vue'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>🐎 Interactive Horse Racing Game</h1>
      <p>Generate horses, create race schedules, and watch exciting races!</p>
    </header>

    <main class="app-main">
      <div class="game-container">
        <!-- Horse Generation Section -->
        <HorseGenerator />

        <!-- Race Scheduling Section -->
        <RaceScheduler />

        <!-- Race Track Section -->
        <RaceTrack />

        <!-- Race Results Section -->
        <RaceResult />
      </div>
    </main>

    <footer class="app-footer">
      <p>Built with Vue.js & Vuex | Horse Racing Game Trial</p>
    </footer>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
}

.app-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.5em;
  font-weight: 700;
}

.app-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.app-main {
  flex: 1;
  padding: 20px;
}

.game-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 15px;
  margin-top: auto;
}

.app-footer p {
  margin: 0;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2em;
  }

  .app-main {
    padding: 10px;
  }

  .game-container {
    gap: 15px;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-container > * {
  animation: fadeIn 0.6s ease-out;
}
</style>
