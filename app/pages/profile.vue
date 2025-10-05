<script setup lang="ts">
import type { PageCardProps } from "@nuxt/ui";

definePageMeta({
  middleware: "auth",
});

const { user, clear } = useUserSession();

const stats = ref<PageCardProps[]>([
  {
    title: "Active links",
    description: "0",
    icon: "i-heroicons-link",
  },
  {
    title: "Views",
    description: "0",
    icon: "i-heroicons-chart-bar",
  },
  {
    title: "Last activity",
    description: "Today",
    icon: "i-heroicons-clock",
  },
]);

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
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                Your links
              </h2>
              <UButton icon="i-heroicons-plus"> Add link </UButton>
            </div>
          </template>

          <ProfileNoLinks />
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
