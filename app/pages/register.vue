<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { z } from "zod";

const { fetch } = useUserSession();

const loading = ref(false);

const fields: AuthFormField[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Choose a username",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "your@email.com",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a password",
    required: true,
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm your password",
    required: true,
  },
];

type CreateUserType = z.infer<typeof createUserSchema>;
async function handleRegister(event: FormSubmitEvent<CreateUserType>) {
  loading.value = true;

  try {
    await $fetch<User>("/api/auth/register", {
      method: "POST",
      body: {
        username: event.data.username,
        email: event.data.email,
        password: event.data.password,
      },
    });

    await fetch();
    await navigateTo("/profile");
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid place-items-center h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="createUserSchema"
        :fields
        title="Create Your Link Tree"
        description="Join Kantan and start building your personalized link tree today"
        icon="i-heroicons-link"
        :loading
        @submit="handleRegister"
      >
        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <NuxtLink
              to="/login"
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in
            </NuxtLink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
