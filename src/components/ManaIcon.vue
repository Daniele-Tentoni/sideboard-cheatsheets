<template>
  <img height="16px" :src="src" alt="W" />
</template>

<script setup lang="ts">
import W from '@/assets/svg/W.svg'
import B from '@/assets/svg/B.svg'
import R from '@/assets/svg/R.svg'
import G from '@/assets/svg/G.svg'
import U from '@/assets/svg/U.svg'
import { computed } from 'vue'

const p = withDefaults(defineProps<{ icon: string }>(), { icon: 'W' })

const map: { [key: string]: string } = { W: W, R: R, G: G, B: B, U: U }

const src = computed(() => map[p.icon] ?? W)
</script>
