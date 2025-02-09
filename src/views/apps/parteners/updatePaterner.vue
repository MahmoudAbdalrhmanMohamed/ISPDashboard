<template>
  <!-- Image Preview Dialog -->
  <el-dialog v-model="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>

  <!-- Form for Image Update -->
  <el-form
    @submit.prevent="submit"
    :model="localFormData"
    :rules="rules"
    ref="formRef"
  >
    <div class="modal-body py-10">
      <!-- Photo Upload -->
      <div class="fv-row mb-7">
        <label class="required fs-6 fw-semibold mb-2">{{
          $t("uploadPhoto")
        }}</label>
        <el-form-item prop="files">
          <el-upload
            v-model:file-list="localFormData.files"
            class="upload-demo"
            :limit="1"
            :auto-upload="false"
            accept=".jpg,.png"
            list-type="picture-card"
            :on-change="handleUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
          >
            <el-button type="primary">{{ $t("uploadPhoto") }}</el-button>
          </el-upload>
        </el-form-item>
      </div>
    </div>

    <!-- Footer with buttons -->

    <button
      :data-kt-indicator="loading ? 'on' : null"
      class="btn w-full btn-lg btn-primary flex text-center justify-center items-center"
      type="submit"
    >
      <span v-if="!loading">{{ $t("updatePhoto") }}</span>
      <span v-if="loading" class="indicator-progress">
        {{ $t("pleaseWait") }}
        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
      </span>
    </button>
  </el-form>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
// Local State
const formRef = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const changeImg = ref(false);
const loading = ref(false);
const id = ref(null);

// Form data
const localFormData = ref({
  files: [],
});

// Validation Rules
const rules = ref({
  files: [
    { required: true, message: "Please upload an image", trigger: "change" },
  ],
});

// File Handlers
const handleRemove = () => {
  errorVal.value = false;
};

const handleUpload = (file) => {
  if (file.size / 1024 / 1024 > 0.5) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  changeImg.value = true;
  return true;
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// Reset Form
const resetForm = () => {
  formRef.value?.resetFields();
  localFormData.value = {
    files: [],
  };
};

const fecthing = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/partners/${route.params.parteners}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    localFormData.value.files[0] = {
      url: data.value.data.image,
      name: data.value.data.id,
    };
  } catch (error) {
    console.log(error.message);
  }
};
fecthing();
// Submit Form
const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      const formDataToSend = new FormData();

      if (localFormData.value.files.length) {
        formDataToSend.append("image_file", localFormData.value.files[0].raw);
      } else {
        Swal.fire({
          text: "Please select an image to upload.",
          icon: "error",
          confirmButtonText: "OK",
        });
        loading.value = false;
        return;
      }

      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/partners/${route.params.parteners}?_method=PUT`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      ).json();

      loading.value = false;

      if (data.value?.status) {
        Swal.fire({
          text: "Photo updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
        router.push({ name: "apps-parteners" });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: "Failed to update photo. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};
</script>
