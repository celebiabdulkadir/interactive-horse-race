<script lang="ts" setup>
const props = defineProps({
  countdown: {
    type: Number,
    required: true,
  },
  countdownActive: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div v-if="countdownActive" class="countdown-overlay">
    <div class="countdown-number">{{ props.countdown }}</div>
  </div>
</template>

<style scoped>
.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.countdown-number {
  font-size: 150px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}
</style>
