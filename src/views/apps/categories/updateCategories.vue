<template>
  <div v-if="!loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <div class="modal-body py-10">
        <div v-for="lang in languages" :key="lang.code" class="mb-10">
          <h2 class="text-2xl capitalize font-bold text-gray-800">
            {{ $t(lang.lang) }}
          </h2>
          <hr class="w-full mb-4 bg-gray-800" />

          <!-- Category Name -->
          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("categoryName")
            }}</label>
            <el-form-item :prop="`names.${lang.code}`">
              <el-input
                v-model="formData.names[lang.code]"
                class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
                autocomplete="off"
              />
            </el-form-item>
          </div>
        </div>
      </div>

      <button
        class="btn btn-lg btn-primary flex justify-center w-full text-center items-center"
        :data-kt-indicator="loading ? 'on' : null"
        type="submit"
      >
        <span v-if="!loading">{{ $t("updateCategory") }}</span>
        <span v-if="loading" class="indicator-progress">
          {{ $t("pleaseWait") }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </el-form>
  </div>
  <div v-else class="w-screen h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";

const formRef = ref(null);
const loading = ref(false);
const router = useRouter();
const route = useRoute();

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
];

const formData = ref({
  names: {},
});

const rules = ref({
  names: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      {
        required: true,
        message: `${code} Category Name is required`,
        min: 3,
        trigger: "blur",
      },
    ]),
  ),
});

const fetchCategory = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/categories/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    if (response.ok) {
      formData.value.names = data.data.name;
    } else {
      throw new Error(data.message || "Failed to fetch category.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      confirmButtonText: "Retry",
    });
  } finally {
    loading.value = false;
  }
};

fetchCategory();

const onSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    const payload = JSON.stringify({ name: formData.value.names });
    console.log(payload);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/categories/${route.params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: payload,
        },
      );

      const data = await response.json();
      loading.value = false;

      if (response.ok && data?.status) {
        Swal.fire({
          text: "Category updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        router.push({ name: "apps-categories" });
      } else {
        throw new Error(data.message || "Failed to update category.");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: error.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};
</script>
