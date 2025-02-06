<template>
  <div v-if="!loading">
    <el-form :model="formData" ref="formRef" label-position="top">
      <!-- Team Member Image Upload -->
      <el-form-item label="Image" :error="errors.image">
        <el-upload
          v-model:file-list="formData.imageFile"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          accept=".jpg,.jpeg,.png"
          list-type="picture-card"
          :on-change="handleImageChange"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
        >
          <el-button type="primary">Upload Image</el-button>
        </el-upload>
      </el-form-item>

      <!-- Name -->
      <el-form-item label="Name" :error="errors.name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>

      <!-- Role -->
      <el-form-item label="Role" :error="errors.role">
        <el-input v-model="formData.role" autocomplete="off" />
      </el-form-item>

      <!-- Description -->
      <el-form-item label="Description" :error="errors.description">
        <el-input type="textarea" v-model="formData.description" :rows="4" />
      </el-form-item>

      <!-- Contact -->
      <el-form-item label="Contact" :error="errors.contact">
        <el-input v-model="formData.contact" autocomplete="off" />
      </el-form-item>

      <!-- LinkedIn URL -->
      <el-form-item label="LinkedIn URL" :error="errors.linkedin">
        <el-input v-model="formData.linkedin" autocomplete="off" />
      </el-form-item>

      <!-- Submit Button -->
      <el-form-item>
        <el-button
          type="primary"
          class="w-full text-center py-3"
          @click="onSubmit"
          :loading="loading"
        >
          Add Team Member
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Image Preview Dialog -->
    <el-dialog v-model="dialogVisible" width="50%">
      <img :src="dialogImageUrl" style="width: 100%" alt="Preview Image" />
    </el-dialog>
  </div>

  <div v-else class="w-screen h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import * as Yup from "yup";

const formRef = ref(null);
const loading = ref(false);
const router = useRouter();

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// Form data for the team member
const formData = ref({
  imageFile: [],
  name: "",
  role: "",
  description: "",
  contact: "",
  linkedin: "",
});

// Error messages object
const errors = ref({
  image: "",
  name: "",
  role: "",
  description: "",
  contact: "",
  linkedin: "",
});

// Yup validation schema
const schema = Yup.object().shape({
  imageFile: Yup.array()
    .min(1, "Image is required")
    .required("Image is required"),
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  contact: Yup.string().required("Contact is required"),
  linkedin: Yup.string()
    .url("Invalid LinkedIn URL")
    .required("LinkedIn URL is required"),
});

// Reset form data and errors
const resetForm = () => {
  formData.value = {
    imageFile: [],
    name: "",
    role: "",
    description: "",
    contact: "",
    linkedin: "",
  };
  errors.value = {
    image: "",
    name: "",
    role: "",
    description: "",
    contact: "",
    linkedin: "",
  };
};

// Form submission
const onSubmit = async () => {
  // Clear previous errors
  errors.value = {
    image: "",
    name: "",
    role: "",
    description: "",
    contact: "",
    linkedin: "",
  };

  try {
    // Validate form data using Yup
    await schema.validate(formData.value, { abortEarly: false });
  } catch (validationError) {
    // Map Yup errors to our errors object
    if (validationError.inner) {
      validationError.inner.forEach((err) => {
        if (err.path === "imageFile") {
          errors.value.image = err.message;
        } else {
          errors.value[err.path] = err.message;
        }
      });
    }
    return;
  }

  // If valid, submit the data
  loading.value = true;
  try {
    const payload = new FormData();
    payload.append("name", formData.value.name);
    payload.append("role", formData.value.role);
    payload.append("description", formData.value.description);
    payload.append("contact", formData.value.contact);
    payload.append("linkedin", formData.value.linkedin);

    if (formData.value.imageFile.length) {
      payload.append("image_file", formData.value.imageFile[0].raw);
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/team`,
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
        text: data.message || "Team member added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      resetForm();
      router.push({ name: "apps-team-all" });
    } else {
      throw new Error(data.message || "Failed to add team member.");
    }
  } catch (error) {
    loading.value = false;
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      confirmButtonText: "Retry",
    });
  }
};

// Handle image upload events
const handleImageChange = (file, fileList) => {
  console.log("File uploaded:", file.name);
  return true;
};

const handleRemove = (file, fileList) => {
  console.log("File removed:", file.name);
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
</script>
