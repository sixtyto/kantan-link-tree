<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <UError :error />
    </NuxtLayout>
  </UApp>
</template>
