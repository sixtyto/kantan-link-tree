<script setup lang="ts">
const links = ref<Link[]>([]);
const isModalOpen = ref(false);
const editingLink = ref<Link | null>(null);
const isLoading = ref(true);

async function fetchLinks() {
  isLoading.value = true;
  try {
    const data = await $fetch<Link[]>("/api/links/list");
    links.value = data;
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to fetch links",
      description: "Please try again later.",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

function handleAddClick() {
  editingLink.value = null;
  isModalOpen.value = true;
}

function handleEditClick(link: Link) {
  editingLink.value = { ...link };
  isModalOpen.value = true;
}

function handleSaved() {
  fetchLinks();
}

onMounted(() => {
  fetchLinks();
});
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="space-y-2">
      <USkeleton class="h-20 w-full rounded-lg" />
      <USkeleton class="h-20 w-full rounded-lg" />
      <USkeleton class="h-20 w-full rounded-lg" />
    </div>

    <div v-else-if="links.length === 0">
      <ProfileNoLinks @add="handleAddClick" />
    </div>

    <div v-else class="space-y-2">
      <button
        v-for="link in links"
        :key="link.id"
        class="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
        @click="handleEditClick(link)"
      >
        <div class="flex items-center gap-3">
          <div
            v-if="link.icon"
            class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center"
          >
            <UIcon :name="link.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-900 dark:text-white truncate">
              {{ link.title }}
            </h4>
            <p
              v-if="link.description"
              class="text-sm text-gray-500 dark:text-gray-400 truncate"
            >
              {{ link.description }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-chevron-right"
            class="w-5 h-5 text-gray-400"
          />
        </div>
      </button>
    </div>

    <UButton
      icon="i-heroicons-plus"
      block
      variant="outline"
      @click="handleAddClick"
    >
      Add Link
    </UButton>

    <ProfileLinkModal
      v-model="isModalOpen"
      :link="editingLink"
      @saved="handleSaved"
    />
  </div>
</template>
