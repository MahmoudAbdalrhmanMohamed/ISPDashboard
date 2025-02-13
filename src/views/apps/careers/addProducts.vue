<template>
  <div v-if="!loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <div class="modal-body py-10 px-lg-17">
        <!-- Loop through languages for multi-language fields -->
        <div v-for="lang in languages" :key="lang.code" class="mb-10">
          <h2 class="text-2xl capitalize font-bold text-gray-800">
            {{ $t(lang.lang) }}
          </h2>
          <hr class="w-full mb-4 bg-gray-800" />

          <!-- Product Name -->
          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("productName")
            }}</label>
            <el-form-item :prop="`names.${lang.code}`">
              <el-input
                class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
                v-model="formData.names[lang.code]"
                autocomplete="off"
              />
            </el-form-item>
          </div>

          <!-- Product Description -->
          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("productDescription")
            }}</label>
            <el-form-item :prop="`descriptions.${lang.code}`">
              <el-input
                class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
                v-model="formData.descriptions[lang.code]"
                type="textarea"
                :rows="4"
              />
              <small class="text-gray-500">
                {{ formData.descriptions[lang.code]?.length || 0 }}/50
                characters
              </small>
            </el-form-item>
          </div>
        </div>

        <!-- Product Categories -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("productCategories")
          }}</label>
          <el-form-item prop="categories">
            <el-select
              v-model="formData.categories"
              multiple
              placeholder="Select Categories"
              class="w-full"
            >
              <el-option
                v-for="category in categories"
                :key="category"
                :label="category"
                :value="category"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- Product Image Upload -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("productImage")
          }}</label>
          <el-form-item prop="imageFile">
            <el-upload
              v-model:file-list="formData.imageFile"
              class="upload-demo"
              :limit="1"
              :auto-upload="false"
              accept="image/*"
              list-type="picture-card"
              :on-change="handleImageChange"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
            >
              <el-button type="primary">{{ $t("uploadImage") }}</el-button>
            </el-upload>
          </el-form-item>
        </div>

        <!-- Country -->
        <!-- <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("country")
          }}</label>
          <el-form-item prop="country">
            <el-input
              class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
              v-model="formData.country"
              autocomplete="off"
            />
          </el-form-item>
        </div> -->
      </div>

      <div class="modal-footer flex-center">
        <button
          type="button"
          class="btn btn-light me-3"
          @click="resetForm"
          aria-label="Discard Changes"
        >
          {{ $t("discard") }}
        </button>
        <button
          class="btn btn-lg btn-primary d-flex items-center"
          :data-kt-indicator="loading ? 'on' : null"
          type="submit"
        >
          <span v-if="!loading">{{ $t("addProduct") }}</span>
          <span v-if="loading" class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </el-form>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>

  <div v-else class="w-screen h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { useRouter } from "vue-router";

const formRef = ref(null);
const dialogImageUrl = ref(null);
const dialogVisible = ref(null);
const loading = ref(false);

const router = useRouter();

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
  // { lang: "chinese", code: "zh" },
  // { lang: "indian", code: "hi" },
  // { lang: "italian", code: "it" },
  // { lang: "spanish", code: "es" },
  // { lang: "russian", code: "ru" },
  // { lang: "turkish", code: "tr" },
  // { lang: "french", code: "fr" },
  // { lang: "german", code: "de" },
];

const formData = ref({
  names: {},
  descriptions: {},
  categories: [],
  imageFile: [],
  // country: "",
});

const categories = ref(["Electronics", "Clothing", "Toys", "Books", "Sports"]);

const rules = ref({
  names: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      {
        required: true,
        message: `${code} Product Name is required`,
        min: 4,
        trigger: "blur",
      },
    ]),
  ),
  descriptions: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      {
        required: true,
        min: 50,
        message: `${code} Description must be at least 50 characters`,
        trigger: "blur",
      },
    ]),
  ),
  // country: [
  //   { required: true, message: "Country is required", trigger: "blur" },
  // ],
  imageFile: [
    { required: true, message: "Product Image is required", trigger: "change" },
  ],
});

const resetForm = () => {
  formRef.value?.resetFields();
  formData.value = {
    names: {},
    descriptions: {},
    categories: [],
    imageFile: [],
    // country: "",
  };
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      // Create a new FormData object
      const payload = new FormData();
      // payload.append("country", formData.value.country);
      payload.append("categories", formData.value.categories.join(","));

      // Add names and descriptions
      languages.forEach((lang) => {
        payload.append(`name[${lang.code}]`, formData.value.names[lang.code]);
        payload.append(
          `description[${lang.code}]`,
          formData.value.descriptions[lang.code],
        );
      });

      // Add image file
      if (formData.value.imageFile.length) {
        payload.append("image_file", formData.value.imageFile[0].raw);
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: payload,
        },
      );

      const data = await response.json();
      loading.value = false;

      if (response.ok && data?.status) {
        Swal.fire({
          text: "Product added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
        router.push({ name: "apps-products-all" });
      } else {
        throw new Error(data.message || "Failed to add product.");
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

const handleImageChange = (file) => {
  console.log("File uploaded:", file.name);
  return true;
};

const handleRemove = (file) => {
  console.log("File removed:", file.name);
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
</script>
