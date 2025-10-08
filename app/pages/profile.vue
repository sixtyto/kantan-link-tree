<script setup lang="ts">
import type { PageCardProps } from "@nuxt/ui";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "My Profile - Kantan Link Tree",
  meta: [
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
});

const { user, clear } = useUserSession();

const links = ref<Link[]>([]);
const socialLinks = ref<SocialLink[]>([]);

const stats = computed<PageCardProps[]>(() => {
  const customLinkClicks = links.value.reduce(
    (sum, link) => sum + (link.clicks || 0),
    0
  );
  const socialLinkClicks = socialLinks.value.reduce(
    (sum, link) => sum + (link.clicks || 0),
    0
  );
  const totalClicks = customLinkClicks + socialLinkClicks;

  const visibleLinks = links.value.filter((link) => link.isVisible).length;
  const totalActiveLinks = visibleLinks + socialLinks.value.length;

  return [
    {
      title: "All links",
      description: String(totalActiveLinks),
      icon: "i-heroicons-link",
    },
    {
      title: "Total clicks",
      description: String(totalClicks),
      icon: "i-heroicons-cursor-arrow-rays",
    },
  ];
});

loadData();
async function loadData() {
  try {
    const [linksData, socialLinksData] = await Promise.all([
      $fetch<Link[]>("/api/links/list"),
      $fetch<SocialLink[]>("/api/social-links/list"),
    ]);
    links.value = linksData;
    socialLinks.value = socialLinksData;
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

function handleLogout() {
  clear();
  navigateTo("/login");
}
</script>

<template>
  <UPage>
    <UPageHeader
      headline="Your link tree dashboard"
      title="Profile"
      :description="`Welcome back, ${
        user?.username || 'User'
      }! Manage your links and track your performance.`"
    />
    <UPageBody>
      <UPageGrid>
        <UPageCard
          v-for="card in stats"
          :key="card.title"
          variant="subtle"
          v-bind="card"
        />
      </UPageGrid>

      <UPageGrid>
        <UPageCard
          class="lg:col-span-2"
          variant="subtle"
          :ui="{ header: 'w-full' }"
        >
          <template #header>
            <div class="flex flex-col gap-4">
              <div>
                <h2
                  class="text-lg font-medium text-gray-900 dark:text-white mb-1"
                >
                  Social Links
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Click icons to add or edit your social media links
                </p>
              </div>
              <ProfileSocialLinksSection @saved="loadData" />
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-3"
              >
                Custom Links
              </h3>
              <ProfileLinksSection @saved="loadData" />
            </div>
          </div>
        </UPageCard>

        <div>
          <UPageCard title="Your profile" variant="subtle">
            <div class="flex items-center gap-2">
              <UAvatar :text="user?.username?.charAt(0).toUpperCase() || 'U'" />
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ user?.username || "User" }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user?.email || "no email" }}
                </p>
              </div>
            </div>

            <div class="space-y-2 mt-4">
              <UButton
                variant="outline"
                color="primary"
                block
                :to="`/u/${user?.username}`"
                target="_blank"
              >
                <template #leading>
                  <UIcon name="i-heroicons-eye" />
                </template>
                View Public Profile
              </UButton>

              <UButton variant="outline" block to="/settings">
                <template #leading>
                  <UIcon name="i-heroicons-cog-6-tooth" />
                </template>
                Settings
              </UButton>

              <UButton
                variant="outline"
                color="error"
                block
                @click="handleLogout"
              >
                <template #leading>
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" />
                </template>
                Logout
              </UButton>
            </div>
          </UPageCard>
        </div>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
