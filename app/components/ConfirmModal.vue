<script setup lang="ts">
const {
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  handleConfirm,
  handleCancel,
} = useConfirm();
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="title"
    :ui="{ footer: 'flex justify-end items-center gap-2' }"
  >
    <template #body>
      <p v-if="description" class="text-sm text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </template>

    <template #footer>
      <UButton variant="outline" @click="handleCancel">
        {{ cancelText }}
      </UButton>

      <UButton color="error" @click="handleConfirm">
        {{ confirmText }}
      </UButton>
    </template>
  </UModal>
</template>
