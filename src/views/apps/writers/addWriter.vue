<template>
  <div v-if="!loading" class="md:py-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="kt_website_settings_form"
      @submit="onSubmit"
      :validation-schema="schema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("websiteSettings") }}
        </h1>
      </div>

      <!-- Website URL -->
      <!-- <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("website") }}
        </label>
        <Field
          name="website"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="website" />
          </div>
        </div>
      </div> -->

      <!-- Phone 1 -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("phone1") }}
        </label>
        <Field
          name="phone1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="phone1" />
          </div>
        </div>
      </div>

      <!-- Phone 2 -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("phone2") }}
        </label>
        <Field
          name="phone2"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="phone2" />
          </div>
        </div>
      </div>

      <!-- Facebook URL -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("facebook") }}
        </label>
        <Field
          name="facebook"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="facebook" />
          </div>
        </div>
      </div>

      <!-- Instagram URL -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("instagram") }}
        </label>
        <Field
          name="instagram"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="instagram" />
          </div>
        </div>
      </div>

      <!-- LinkedIn URL -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("linkedin") }}
        </label>
        <Field
          name="linkedin"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="linkedin" />
          </div>
        </div>
      </div>

      <!-- YouTube URL -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("youtube") }}
        </label>
        <Field
          name="youtube"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="youtube" />
          </div>
        </div>
      </div>

      <!-- Email -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("email") }}
        </label>
        <Field
          name="email"
          class="form-control form-control-lg form-control-solid"
          type="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>

      <!-- WhatsApp URL -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ $t("whatsapp") }}
        </label>
        <Field
          name="whatsapp"
          class="form-control form-control-lg form-control-solid"
          type="text"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="whatsapp" />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_website_settings_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("saveSettings") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
  </div>

  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";

const router = useRouter();
const loading = ref(false);
const submitButton = ref(null);
const { t } = useI18n();

// Validation schema
const schema = Yup.object().shape({
  // website: Yup.string().url("Invalid URL").required("Website URL is required"),
  phone1: Yup.string().required("Phone 1 is required"),
  phone2: Yup.string().required("Phone 2 is required"),
  facebook: Yup.string().url("Invalid URL").nullable(),
  instagram: Yup.string().url("Invalid URL").nullable(),
  linkedin: Yup.string().url("Invalid URL").nullable(),
  youtube: Yup.string().url("Invalid URL").nullable(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  whatsapp: Yup.string().url("Invalid URL").nullable(),
});

// Submit form
const onSubmit = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Prepare payload
    const payload = {
      // website: values.website,
      phone1: values.phone1,
      phone2: values.phone2,
      facebook: values.facebook,
      instagram: values.instagram,
      linkedin: values.linkedin,
      youtube: values.youtube,
      email: values.email,
      whatsapp: values.whatsapp,
    };

    // Make API request to website settings endpoint
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/website-settings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Website settings saved successfully!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-website-settings" });
      });
    } else {
      throw new Error(data?.message || "Failed to save website settings.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
      loading.value = false;
    }
  }
};
</script>
