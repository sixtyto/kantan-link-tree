<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const socialLinkSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

const open = defineModel<boolean>({ required: true });

const { link } = defineProps<{
  link: SocialLink | null;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const socialPlatformLabels: Record<SocialPlatform, string> = {
  [SocialPlatform.INSTAGRAM]: "Instagram",
  [SocialPlatform.TIKTOK]: "TikTok",
  [SocialPlatform.YOUTUBE]: "YouTube",
  [SocialPlatform.TWITTER]: "X (Twitter)",
  [SocialPlatform.GITHUB]: "GitHub",
  [SocialPlatform.EMAIL]: "Email",
};

const state = reactive({
  url: "",
});

const isLoading = ref(false);

const isEditing = computed(() => link?.id !== "");

const platformLabel = computed(() =>
  link?.platform ? socialPlatformLabels[link.platform] : "Social Link"
);

const isEmailPlatform = computed(() => link?.platform === SocialPlatform.EMAIL);

const placeholder = computed(() =>
  isEmailPlatform.value ? "you@example.com" : "username or URL"
);

watch(
  () => link,
  (newLink) => {
    state.url = newLink?.url || "";
  },
  { immediate: true }
);

async function onSubmit(event: FormSubmitEvent<{ url: string }>) {
  isLoading.value = true;

  const normalizedUrl = normalizeUrl(event.data.url);

  try {
    if (isEditing.value) {
      await $fetch(`/api/social-links/${link!.id}`, {
        method: "PUT",
        body: {
          url: normalizedUrl,
        },
      });
    } else {
      await $fetch("/api/social-links/create", {
        method: "POST",
        body: {
          platform: link!.platform,
          url: normalizedUrl,
        },
      });
    }

    state.url = "";
    emit("saved");
    open.value = false;
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to save social link",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete() {
  const { confirm } = useConfirm();

  const confirmed = await confirm({
    title: "Delete Social Link",
    description:
      "Are you sure you want to delete this social link? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  if (!confirmed) {
    return;
  }

  isLoading.value = true;

  try {
    await $fetch(`/api/social-links/${link!.id}`, {
      method: "DELETE",
    });

    state.url = "";
    emit("saved");
    open.value = false;
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to delete social link",
      description: "Please try again later.",
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
    :title="`${isEditing ? 'Edit' : 'Add'} ${platformLabel}`"
    :ui="{ footer: 'flex justify-between items-center' }"
  >
    <template #body>
      <UForm
        id="social-link-form"
        :state
        :schema="socialLinkSchema"
        @submit="onSubmit"
      >
        <UFormField
          :label="isEmailPlatform ? 'Email' : 'URL'"
          name="url"
          class="w-full"
        >
          <UInput
            v-model="state.url"
            :placeholder="placeholder"
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
      <div v-else />

      <div class="flex gap-2">
        <UButton variant="outline" :disabled="isLoading" @click="open = false">
          Cancel
        </UButton>
        <UButton type="submit" form="social-link-form" :loading="isLoading">
          {{ isEditing ? "Save" : "Add" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
