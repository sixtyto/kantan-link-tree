<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { z } from "zod";

type UpdateProfileType = z.infer<typeof updateProfileSchema>;
const { user, fetch } = useUserSession();

const profileLoading = ref(false);

const profileFields = computed<AuthFormField[]>(() => [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: user.value?.username
      ? `Current: ${user.value.username}`
      : "Enter new username",
    required: false,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: user.value?.email
      ? `Current: ${user.value.email}`
      : "Enter new email",
    required: false,
  },
]);

async function handleProfileUpdate(event: FormSubmitEvent<UpdateProfileType>) {
  profileLoading.value = true;

  try {
    const body: UpdateProfileType = {};
    if (event.data.username && event.data.username.trim()) {
      body.username = event.data.username.trim();
    }
    if (event.data.email && event.data.email.trim()) {
      body.email = event.data.email.trim();
    }

    if (!body.username && !body.email) {
      const toast = useToast();
      toast.add({
        title: "No Changes",
        description: "Please fill in at least one field to update.",
        color: "warning",
      });
      profileLoading.value = false;
      return;
    }

    await $fetch("/api/user/update-profile", {
      method: "POST",
      body,
    });

    await fetch();

    const toast = useToast();
    toast.add({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      color: "success",
    });
  } catch {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update profile. Please try again.",
      color: "error",
    });
  } finally {
    profileLoading.value = false;
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Profile Information
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Update your username and email address
      </p>
    </template>

    <UAuthForm
      :schema="updateProfileSchema"
      :fields="profileFields"
      :loading="profileLoading"
      submit-label="Update Profile"
      @submit="handleProfileUpdate"
    />
  </UCard>
</template>
