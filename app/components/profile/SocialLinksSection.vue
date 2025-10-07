<script setup lang="ts">
const socialLinks = ref<SocialLink[]>([]);
const isModalOpen = ref(false);
const editingLink = ref<SocialLink | null>(null);

const socialPlatformIcons: Record<
  SocialPlatform,
  { icon: string; label: string }
> = {
  [SocialPlatform.INSTAGRAM]: {
    icon: "i-simple-icons-instagram",
    label: "Instagram",
  },
  [SocialPlatform.TIKTOK]: { icon: "i-simple-icons-tiktok", label: "TikTok" },
  [SocialPlatform.YOUTUBE]: {
    icon: "i-simple-icons-youtube",
    label: "YouTube",
  },
  [SocialPlatform.TWITTER]: { icon: "i-simple-icons-x", label: "X (Twitter)" },
  [SocialPlatform.GITHUB]: { icon: "i-simple-icons-github", label: "GitHub" },
  [SocialPlatform.EMAIL]: { icon: "i-heroicons-envelope", label: "Email" },
};

const availablePlatforms = computed(() => {
  const usedPlatforms = socialLinks.value.map((link) => link.platform);
  return Object.keys(socialPlatformIcons).filter(
    (platform) => !usedPlatforms.includes(platform as SocialPlatform)
  );
});

async function fetchSocialLinks() {
  try {
    socialLinks.value = await $fetch<SocialLink[]>("/api/social-links/list");
  } catch {
    const toast = useToast();
    toast.add({
      title: "Failed to fetch social links",
      description: "Please try again later.",
      color: "error",
    });
  }
}

function handleAddClick(platform: SocialPlatform) {
  editingLink.value = {
    id: "",
    platform,
    url: "",
    order: 0,
  };
  isModalOpen.value = true;
}

function handleEditClick(link: SocialLink) {
  editingLink.value = { ...link };
  isModalOpen.value = true;
}

function handleSaved() {
  fetchSocialLinks();
}

onMounted(() => {
  fetchSocialLinks();
});
</script>

<template>
  <div>
    <div class="flex items-center gap-3 flex-wrap">
      <button
        v-for="link in socialLinks"
        :key="link.id"
        class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        @click="handleEditClick(link)"
      >
        <UIcon
          :name="socialPlatformIcons[link.platform]?.icon"
          class="w-5 h-5 text-gray-700 dark:text-gray-300"
        />
      </button>

      <button
        v-for="platform in availablePlatforms"
        :key="platform"
        class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative group"
        @click="handleAddClick(platform as SocialPlatform)"
      >
        <UIcon
          :name="socialPlatformIcons[platform as SocialPlatform]?.icon"
          class="w-5 h-5 text-gray-400 dark:text-gray-500"
        />
        <div
          class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center"
        >
          <UIcon name="i-heroicons-plus" class="w-3 h-3 text-white" />
        </div>
      </button>
    </div>

    <ProfileSocialLinkModal
      v-model="isModalOpen"
      :link="editingLink"
      @saved="handleSaved"
    />
  </div>
</template>
