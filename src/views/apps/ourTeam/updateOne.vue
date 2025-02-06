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
        <el-button type="primary" class="w-full" @click="onSubmit" :loading="loading">
          Update Team Member
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import * as Yup from "yup";

const formRef = ref(null);
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const teamId = route.params.id; // Ensure your route provides an "id" parameter

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
  // For updating, image is optional if not changed
  imageFile: Yup.array().nullable(),
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

// Load existing team member data
const loadTeamMember = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/team/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    if (response.ok && data?.status) {
      // Assuming the response returns the team member data under "team"
      formData.value.name = data.team.name;
      formData.value.role = data.team.role;
      formData.value.description = data.team.description;
      formData.value.contact = data.team.contact;
      formData.value.linkedin = data.team.linkedin;
      // If an image URL exists, set it as the current file in the upload component
      if (data.team.image_url) {
        formData.value.imageFile = [
          {
            name: "Current Image",
            url: data.team.image_url,
          },
        ];
      }
    } else {
      throw new Error(data.message || "Failed to load team member data.");
    }
  } catch (error) {
    Swal.fire({
      text:
        error.message || "Something went wrong while loading team member data!",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeamMember();
});

// Form submission for updating the team member
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
    await schema.validate(formData.value, { abortEarly: false });
  } catch (validationError) {
    if (validationError.inner) {
      validationError.inner.forEach((err) => {
        // For the imageFile, use a generic error key
        if (err.path === "imageFile") {
          errors.value.image = err.message;
        } else {
          errors.value[err.path] = err.message;
        }
      });
    }
    return;
  }

  loading.value = true;
  try {
    const payload = new FormData();
    payload.append("name", formData.value.name);
    payload.append("role", formData.value.role);
    payload.append("description", formData.value.description);
    payload.append("contact", formData.value.contact);
    payload.append("linkedin", formData.value.linkedin);

    // Append the image file only if a new file is selected.
    // The upload component's file objects will include a "raw" property for newly selected files.
    if (formData.value.imageFile.length && formData.value.imageFile[0].raw) {
      payload.append("image_file", formData.value.imageFile[0].raw);
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/team/${teamId}`,
      {
        method: "PUT", // or PATCH if your API uses that method
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
        text: data.message || "Team member updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      router.push({ name: "apps-team-all" });
    } else {
      throw new Error(data.message || "Failed to update team member.");
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
