<template>
  <div class="horse-generator">
    <div class="header">
      <h2>Horse Generator</h2>
      <button @click="generateHorses" class="btn btn-primary" :disabled="isRacing">
        Generate Horses
      </button>
    </div>

    <div v-if="horses.length > 0" class="horses-grid">
      <div
        v-for="horse in horses"
        :key="horse.id"
        class="horse-card"
        :style="{ borderColor: horse.color }"
      >
        <div class="horse-info">
          <div class="horse-name">{{ horse.name }}</div>
          <div class="horse-details">
            <span class="condition">Condition: {{ horse.condition }}/100</span>
            <div class="color-indicator" :style="{ backgroundColor: horse.color }"></div>
          </div>
          <div class="condition-bar">
            <div
              class="condition-fill"
              :style="{
                width: `${horse.condition}%`,
                backgroundColor: horse.color,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-horses">
      <p>No horses generated yet. Click "Generate Horses" to start!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const horses = computed(() => store.getters['horses/getAllHorses'])
const isRacing = computed(() => store.getters['races/isRacing'])

const generateHorses = () => {
  store.dispatch('horses/generateHorses')
}
</script>

<style scoped>
.horse-generator {
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
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.horses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.horse-card {
  background: white;
  border: 3px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.horse-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.horse-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.horse-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.condition {
  font-size: 14px;
  color: #7f8c8d;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.condition-bar {
  width: 100%;
  height: 6px;
  background-color: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
}

.condition-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.no-horses {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.no-horses p {
  margin: 0;
  font-size: 16px;
}
</style>
