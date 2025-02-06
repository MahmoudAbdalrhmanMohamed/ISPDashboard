<template>
  <div v-if="!loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="onSubmit"
    >
      <div class="modal-body py-10 px-lg-17">
        <div v-for="lang in languages" :key="lang.code" class="mb-10">
          <h2 class="text-2xl capitalize font-bold text-gray-800">
            {{ $t(lang.lang) }}
          </h2>
          <hr class="w-full mb-4 bg-gray-800" />

          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("productName")
            }}</label>
            <el-form-item :prop="`names.${lang.code}`">
              <el-input v-model="formData.names[lang.code]" />
            </el-form-item>
          </div>

          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("productDescription")
            }}</label>
            <el-form-item :prop="`descriptions.${lang.code}`">
              <el-input
                v-model="formData.descriptions[lang.code]"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </div>
        </div>

        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("productCategories")
          }}</label>
          <el-form-item prop="categories">
            <el-select v-model="formData.categories" multiple>
              <el-option
                v-for="category in categories"
                :key="category"
                :label="category"
                :value="category"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("country")
          }}</label>
          <el-form-item prop="country">
            <el-input v-model="formData.country" />
          </el-form-item>
        </div>
      </div>

      <button class="btn w-full text-center btn-lg btn-primary" type="submit">
        {{ $t("updateProduct") }}
      </button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";

const formRef = ref(null);
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const productId = route.params.product;

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
];
const categories = ref(["Electronics", "Clothing", "Toys", "Books", "Sports"]);

const formData = ref({
  names: {},
  descriptions: {},
  categories: [],
  country: "",
});

const rules = ref({
  names: {},
  descriptions: {},
  country: [
    { required: true, message: "Country is required", trigger: "blur" },
  ],
});

onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/products/${productId}`,
    );
    const data = await response.json();
    if (response.ok) {
      formData.value = {
        names: data.names,
        descriptions: data.descriptions,
        categories: data.categories,
        country: data.country,
      };
    } else {
      throw new Error("Failed to fetch product");
    }
  } catch (error) {
    Swal.fire({ text: error.message, icon: "error" });
  } finally {
    loading.value = false;
  }
});

const onSubmit = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/products/${productId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.value),
      },
    );

    if (response.ok) {
      Swal.fire({ text: "Product updated successfully!", icon: "success" });
      router.push({ name: "apps-products-all" });
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    Swal.fire({ text: error.message, icon: "error" });
  } finally {
    loading.value = false;
  }
};
</script>
