<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
const list = theme.value.weeklyList || []
</script>

<template>
  <div class="weekly-grid">
    <a v-for="item in list" :key="item.link" :href="item.link" class="weekly-card">
      <div class="card-header">
        <span v-if="item.isLatest" class="card-badge">最新</span>
        <span class="card-date">{{ item.date }}</span>
      </div>
      <div class="card-title">{{ item.title }}</div>
      <div class="card-desc">{{ item.desc }}</div>
    </a>
  </div>
</template>
