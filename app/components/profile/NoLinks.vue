<script setup lang="ts">
const emit = defineEmits<{
  add: [];
}>();
</script>

<template>
  <div class="text-center py-12">
    <UIcon
      name="i-heroicons-link"
      class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
    />

    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      Your link tree is empty
    </h3>

    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Add links to your social media, website, or any content you want to share
      with your audience.
    </p>

    <div class="mt-6">
      <UButton icon="i-heroicons-plus" @click="emit('add')">
        Add your first link
      </UButton>
    </div>
  </div>
</template>
