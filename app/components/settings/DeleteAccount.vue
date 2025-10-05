<script setup lang="ts">
const { clear } = useUserSession();

const deleteLoading = ref(false);
const showDeleteConfirm = ref(false);
const deleteConfirmText = ref("");

async function handleDeleteAccount() {
  if (deleteConfirmText.value !== "DELETE") {
    const toast = useToast();
    toast.add({
      title: "Confirmation Required",
      description: "Please type 'DELETE' to confirm account deletion.",
      color: "error",
    });
    return;
  }

  deleteLoading.value = true;

  try {
    await $fetch("/api/user/delete-account", {
      method: "DELETE",
    });

    await clear();
    await navigateTo("/");

    const toast = useToast();
    toast.add({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      color: "success",
    });
  } catch {
    const toast = useToast();
    toast.add({
      title: "Deletion Failed",
      description: "Failed to delete account. Please try again.",
      color: "error",
    });
  } finally {
    deleteLoading.value = false;
    showDeleteConfirm.value = false;
    deleteConfirmText.value = "";
  }
}
</script>

<template>
  <UPageCard
    title="Delete Account"
    description="Permanently delete your account and all associated data"
  >
    <div class="space-y-4">
      <div
        class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <div class="flex">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="h-5 w-5 text-red-400"
          />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              Warning: This action cannot be undone
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>
                This will permanently delete your account and remove all data
                from our servers. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>

      <UButton
        v-if="!showDeleteConfirm"
        color="error"
        variant="outline"
        @click="showDeleteConfirm = true"
      >
        Delete Account
      </UButton>

      <div v-else class="space-y-4">
        <div
          class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-sm text-red-700 dark:text-red-300 mb-3">
            To confirm deletion, type <strong>DELETE</strong> in the box below:
          </p>
          <UInput
            v-model="deleteConfirmText"
            placeholder="Type DELETE to confirm"
            class="mb-3"
          />
          <div class="flex gap-2">
            <UButton
              color="error"
              :loading="deleteLoading"
              @click="handleDeleteAccount"
            >
              Confirm Deletion
            </UButton>
            <UButton
              variant="outline"
              @click="
                showDeleteConfirm = false;
                deleteConfirmText = '';
              "
            >
              Cancel
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UPageCard>
</template>
