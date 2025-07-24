<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import RaceScheduleList from './RaceScheduleList.vue'
const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
const races = computed(() => store.getters['races/allRaces'])
const currentRound = computed(() => store.getters['races/currentRound'])
const totalRounds = computed(() => store.getters['races/totalRounds'])
</script>

<template>
  <div class="race-scheduler">
    <div class="header">
      <h3>📅 Race Schedule</h3>
      <div v-if="races.length > 0" class="round-indicator">
        {{ currentRound }}/{{ totalRounds }}
      </div>
    </div>

    <div v-if="!horses.length" class="warning">
      📅 Schedule will appear here after generating horses
    </div>

    <RaceScheduleList v-else-if="horses.length > 0 && races.length > 0" />

    <div v-else-if="horses.length > 0 && races.length === 0" class="no-schedule">
      <div class="empty-state">
        <div class="empty-icon">🏁</div>
        <p>No schedule</p>
        Generate schedule to start racing
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-scheduler {
  margin: 10px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e1e8ed;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.round-indicator {
  background: #3498db;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100px;
  color: #7f8c8d;
  font-size: 14px;
  padding: 10px;
}

.color-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.more {
  font-size: 8px;
  color: #95a5a6;
  margin-left: 2px;
}

.no-schedule {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #95a5a6;
}

.empty-state {
  text-align: center;
}

.empty-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.empty-state p {
  margin: 5px 0;
  font-size: 12px;
  font-weight: 600;
}

.empty-state small {
  font-size: 10px;
  color: #bdc3c7;
}
</style>
