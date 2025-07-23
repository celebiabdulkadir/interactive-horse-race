<script lang="ts" setup>
import type { RaceResult } from '../store/types'
import RaceResultCard from './RaceResultCard.vue'
const props = defineProps<{
  showResultModal: boolean
  results: RaceResult[]
  distance?: number
  roundNumber?: number
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="props.showResultModal" class="modal-overlay">
    <div class="modal-content">
      <RaceResultCard
        :results="props.results"
        :distance="props.distance"
        :roundNumber="props.roundNumber"
      />
      <button @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  padding: 32px 24px 24px 24px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  text-align: center;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 18px;
  font-size: 1.6em;
  color: #764ba2;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
}

.modal-content li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1em;
}

.modal-content li:last-child {
  border-bottom: none;
}

.modal-content button {
  margin-top: 12px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-content button:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

@media (min-width: 768px) {
  .modal-content {
    width: 800px;
    max-width: 90vw;
    min-height: 500px;
    padding: 40px;
    font-size: 1.1em;
  }
}

@media (max-width: 767px) {
  .modal-content {
    width: 95vw;
    height: 60vh;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
