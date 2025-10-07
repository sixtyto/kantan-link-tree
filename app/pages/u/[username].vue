<script setup lang="ts">
definePageMeta({
  layout: "none",
});

const route = useRoute();
const username = route.params.username as string;

const { data, error, status } = await useFetch(`/api/u/${username}`, {
  server: true,
});

if (status.value === "error" || error.value) {
  throw createError({
    statusCode: 404,
    message: "User not found",
    fatal: true,
  });
}

const profileData = computed(() => data.value);

const socialIcons: Record<SocialPlatform, string> = {
  youtube: "i-simple-icons-youtube",
  twitter: "i-simple-icons-x",
  tiktok: "i-simple-icons-tiktok",
  instagram: "i-simple-icons-instagram",
  github: "i-simple-icons-github",
  email: "i-heroicons-envelope",
};

const socialColors: Record<SocialPlatform, string> = {
  youtube: "text-red-500",
  twitter: "text-gray-900 dark:text-white",
  tiktok: "text-gray-900 dark:text-white",
  instagram: "text-pink-500",
  github: "text-gray-900 dark:text-white",
  email: "text-blue-500",
};

async function trackLinkClick(linkId: string) {
  try {
    await $fetch(`/api/links/${linkId}/track`, {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to track link click:", error);
  }
}

function handleLinkClick(link: { id: string; url: string }) {
  trackLinkClick(link.id);
  window.open(link.url, "_blank");
}

const themeStyles = computed(() => {
  const profile = profileData.value?.profile;
  if (!profile) return {};

  const styles: Record<string, string> = {};

  if (profile.background) {
    styles.background = profile.background;
  }

  if (profile.fontColor) {
    styles.color = profile.fontColor;
  }

  return styles;
});

useHead({
  title: `${
    profileData.value?.profile?.name || profileData.value?.username
  } - Kantan Link Tree`,
  meta: [
    {
      name: "description",
      content:
        profileData.value?.profile?.bio ||
        `Check out ${profileData.value?.username}'s links`,
    },
  ],
});
</script>

<template>
  <div class="py-8 px-4" :style="themeStyles">
    <UContainer v-if="profileData" class="max-w-2xl">
      <div class="flex flex-col items-center space-y-6">
        <UAvatar
          v-if="profileData?.profile?.avatar"
          :src="profileData.profile.avatar"
          :alt="profileData.profile.name"
          size="3xl"
          class="ring-4 ring-primary-500/20"
        />
        <UAvatar
          v-else
          :alt="profileData?.username"
          size="3xl"
          class="ring-4 ring-primary-500/20"
        >
          <span class="text-4xl">{{
            profileData?.username?.[0]?.toUpperCase() || "U"
          }}</span>
        </UAvatar>

        <div class="text-center space-y-2 max-w-lg">
          <h1 class="text-3xl font-bold">
            {{ profileData?.profile?.name || profileData?.username }}
          </h1>
          <p
            v-if="profileData?.profile?.bio"
            class="text-gray-600 dark:text-gray-400"
          >
            {{ profileData.profile.bio }}
          </p>
        </div>

        <div
          v-if="profileData?.socialLinks && profileData.socialLinks.length > 0"
          class="flex gap-4"
        >
          <UButton
            v-for="social in profileData.socialLinks"
            :key="social.id"
            :icon="socialIcons[social.platform as SocialPlatform]"
            size="xl"
            variant="ghost"
            square
            :to="social.url"
            target="_blank"
            :class="socialColors[social.platform as SocialPlatform]"
          />
        </div>

        <div
          v-if="profileData?.links && profileData.links.length > 0"
          class="w-full space-y-4 mt-8"
        >
          <UCard
            v-for="link in profileData.links"
            :key="link.id"
            class="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            @click="handleLinkClick(link)"
          >
            <div class="flex items-center gap-4">
              <div v-if="link.icon" class="flex-shrink-0">
                <UIcon :name="link.icon" class="w-8 h-8" />
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-lg">
                  {{ link.title }}
                </h3>
                <p
                  v-if="link.description"
                  class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                >
                  {{ link.description }}
                </p>
              </div>

              <UIcon
                name="i-heroicons-arrow-top-right-on-square"
                class="flex-shrink-0 w-5 h-5 text-gray-400"
              />
            </div>
          </UCard>
        </div>

        <div v-else class="text-center py-12">
          <UIcon
            name="i-heroicons-link"
            class="w-16 h-16 mx-auto text-gray-400 mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400">No links yet</p>
        </div>
      </div>
    </UContainer>
  </div>
</template>
