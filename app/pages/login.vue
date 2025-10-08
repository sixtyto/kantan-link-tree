<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import type { z } from "zod";

useHead({
  title: "Login - Kantan Link Tree",
  meta: [
    {
      name: "description",
      content:
        "Sign in to your Kantan Link Tree account to manage your personalized link tree and track your performance.",
    },
    {
      property: "og:title",
      content: "Login - Kantan Link Tree",
    },
    {
      property: "og:description",
      content:
        "Sign in to your Kantan Link Tree account to manage your personalized link tree.",
    },
  ],
});

const { fetch } = useUserSession();

const loading = ref(false);

const fields: AuthFormField[] = [
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
    placeholder: "Your password",
    required: true,
  },
];

type LoginUserType = z.infer<typeof loginUserSchema>;
async function handleLogin(event: FormSubmitEvent<LoginUserType>) {
  loading.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: event.data.email,
        password: event.data.password,
      },
    });

    await fetch();

    const toast = useToast();
    toast.add({
      title: "Welcome back!",
      description: "You have successfully logged in",
      color: "success",
    });

    await navigateTo("/profile");
  } catch (error) {
    console.error("Login error:", error);

    const toast = useToast();
    toast.add({
      title: "Login failed",
      description: "Invalid email or password. Please try again.",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="grid place-items-center h-screen">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginUserSchema"
        :fields="fields"
        title="Welcome Back"
        description="Sign in to manage your link tree"
        icon="i-heroicons-link"
        :loading="loading"
        @submit="handleLogin"
      >
        <template #footer>
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink
              to="/register"
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up
            </NuxtLink>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
