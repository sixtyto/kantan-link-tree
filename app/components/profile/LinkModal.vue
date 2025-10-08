<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { z } from "zod";

const open = defineModel<boolean>({ required: true });

const { link } = defineProps<{
  link: Link | null;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const state = reactive<z.infer<typeof createLinkSchema>>({
  title: "",
  url: "",
  description: "",
  icon: "",
});

const isLoading = ref(false);

const isEditing = computed(() => !!link);

watch(
  () => link,
  (newLink) => {
    if (newLink) {
      state.title = newLink.title || "";
      state.url = newLink.url || "";
      state.description = newLink.description || "";
      state.icon = newLink.icon || "";
    } else {
      state.title = "";
      state.url = "";
      state.description = "";
      state.icon = "";
    }
  },
  { immediate: true }
);

async function onSubmit(
  event: FormSubmitEvent<z.infer<typeof createLinkSchema>>
) {
  isLoading.value = true;

  const normalizedUrl = normalizeUrl(event.data.url);

  try {
    if (isEditing.value) {
      await $fetch(`/api/links/${link!.id}`, {
        method: "PUT",
        body: {
          ...event.data,
          url: normalizedUrl,
        },
      });
    } else {
      await $fetch("/api/links/create", {
        method: "POST",
        body: {
          ...event.data,
          url: normalizedUrl,
        },
      });
    }

    const toast = useToast();
    toast.add({
      title: isEditing.value ? "Link updated" : "Link created",
      description: "Your link has been saved successfully",
      color: "success",
    });

    state.title = "";
    state.url = "";
    state.description = "";
    state.icon = "";
    emit("saved");
    open.value = false;
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to save link",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete() {
  const { confirm } = useConfirm();

  const confirmed = await confirm({
    title: "Delete Link",
    description:
      "Are you sure you want to delete this link? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  if (!confirmed) return;

  isLoading.value = true;

  try {
    await $fetch(`/api/links/${link!.id}`, {
      method: "DELETE",
    });

    const toast = useToast();
    toast.add({
      title: "Link deleted",
      description: "Your link has been removed",
      color: "success",
    });

    state.title = "";
    state.url = "";
    state.description = "";
    state.icon = "";
    emit("saved");
    open.value = false;
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to delete link",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'Edit Link' : 'Add Link'"
    :ui="{ footer: 'flex justify-between items-center' }"
  >
    <template #body>
      <UForm
        id="link-form"
        :state
        :schema="createLinkSchema"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title" required>
          <UInput
            v-model="state.title"
            placeholder="My awesome link"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField label="URL" name="url" required>
          <UInput
            v-model="state.url"
            placeholder="example.com or https://example.com"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Optional description"
            :disabled="isLoading"
            :rows="2"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Icon"
          name="icon"
          help="Use Heroicons or Simple Icons format (e.g., i-heroicons-link)"
        >
          <UInput
            v-model="state.icon"
            placeholder="i-heroicons-link"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        v-if="isEditing"
        color="error"
        variant="ghost"
        :loading="isLoading"
        @click="handleDelete"
      >
        Delete
      </UButton>

      <div class="flex gap-2">
        <UButton variant="outline" :disabled="isLoading" @click="open = false">
          Cancel
        </UButton>
        <UButton type="submit" form="link-form" :loading="isLoading">
          {{ isEditing ? "Save" : "Add" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
