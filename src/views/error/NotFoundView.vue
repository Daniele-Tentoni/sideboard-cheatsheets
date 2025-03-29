<template>Page not found: {{ route.params }}<br />{{ route }}</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
