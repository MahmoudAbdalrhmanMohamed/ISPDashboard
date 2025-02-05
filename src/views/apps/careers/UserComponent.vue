<template>
  <!--begin::Layout-->
  <div class="flex flex-col">
    <!--begin::Sidebar-->
    <div v-if="dataToShow" class="flex-column flex-lg-row-auto w-full mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img
                :src="dataToShow.image"
                alt="image"
                class="rounded-full w-[100px] h-[100px]"
              />
            </div>
            <!--end::Avatar-->

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.first_name }} {{ dataToShow.last_name }}
            </a>
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div
              class="fw-bold rotate collapsible"
              role="button"
              @click="toggleDetails"
            >
              {{ $t("details") }}
              <span class="ms-2" :class="{ 'rotate-180': isDetailsOpen }">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <!--begin::Details content-->
          <div v-if="isDetailsOpen" id="kt_comic_user_details">
            <div class="py-5 fs-6">
              <!--begin::Personal Info-->
              <div class="fw-bold mt-5">{{ $t("firstName") }}</div>
              <div class="text-gray-600">{{ dataToShow.first_name }}</div>

              <div class="fw-bold mt-5">{{ $t("lastName") }}</div>
              <div class="text-gray-600">{{ dataToShow.last_name }}</div>

              <div class="fw-bold mt-5">{{ $t("email") }}</div>
              <div class="text-gray-600">{{ dataToShow.email }}</div>

              <div class="fw-bold mt-5">{{ $t("phone") }}</div>
              <div class="text-gray-600">{{ dataToShow.phone }}</div>

              <div class="fw-bold mt-5">{{ $t("city") }}</div>
              <div class="text-gray-600">{{ dataToShow.city }}</div>

              <div class="fw-bold mt-5">{{ $t("country") }}</div>
              <div class="text-gray-600">{{ dataToShow.country }}</div>

              <!--begin::Education-->
              <div class="fw-bold mt-5">{{ $t("degree") }}</div>
              <div class="text-gray-600">{{ dataToShow.degree }}</div>

              <div class="fw-bold mt-5">{{ $t("graduationYear") }}</div>
              <div class="text-gray-600">{{ dataToShow.graduation_year }}</div>

              <div class="fw-bold mt-5">{{ $t("university") }}</div>
              <div class="text-gray-600">{{ dataToShow.university }}</div>

              <!--begin::Experience-->
              <div class="fw-bold mt-5">{{ $t("jobTitle") }}</div>
              <div class="text-gray-600">{{ dataToShow.job_title }}</div>

              <div class="fw-bold mt-5">{{ $t("company") }}</div>
              <div class="text-gray-600">{{ dataToShow.company }}</div>

              <div class="fw-bold mt-5">{{ $t("department") }}</div>
              <div class="text-gray-600">{{ dataToShow.department }}</div>

              <div class="fw-bold mt-5">{{ $t("jobDescription") }}</div>
              <div class="text-gray-600">{{ dataToShow.job_description }}</div>

              <!--begin::Skills-->
              <div class="fw-bold mt-5">{{ $t("skills") }}</div>
              <div class="text-gray-600">{{ dataToShow.skills }}</div>

              <div class="fw-bold mt-5">{{ $t("qualifications") }}</div>
              <div class="text-gray-600">{{ dataToShow.qualifications }}</div>

              <!--begin::Reference Endearment-->
              <div v-if="dataToShow.references" class="fw-bold mt-5">
                {{ $t("references") }}
              </div>
              <div v-if="dataToShow.references" class="text-gray-600">
                {{ dataToShow.references.name }} -
                {{ dataToShow.references.number }}
              </div>

              <!--begin::Resume-->
              <div v-if="dataToShow.resume" class="fw-bold mt-5">
                {{ $t("resume") }}
              </div>
              <div v-if="dataToShow.resume" class="text-gray-600">
                <a :href="dataToShow.resume" target="_blank">View Resume</a>
              </div>

              <!--begin::Files-->
              <div
                v-if="dataToShow.files && dataToShow.files.length > 0"
                class="fw-bold mt-5"
              >
                {{ $t("files") }}
              </div>
              <ul v-if="dataToShow.files && dataToShow.files.length > 0">
                <li v-for="(file, index) in dataToShow.files" :key="index">
                  <a :href="file.url" target="_blank">{{ file.name }}</a>
                </li>
              </ul>
            </div>
          </div>
          <!--end::Details content-->

          <!--begin::Accept/Reject Buttons-->
          <div class="flex items-center w-full mt-5">
            <button
              class="btn btn-accept me-2 w-full"
              @click="acceptRequest(dataToShow.id)"
            >
              <i class="fas fa-check-circle me-2 pulse-icon"></i>
              {{ $t("accept") }}
            </button>
            <button
              class="btn btn-reject w-full"
              @click="rejectRequest(dataToShow.id)"
            >
              <i class="fas fa-times-circle me-2 pulse-icon"></i>
              {{ $t("reject") }}
            </button>
          </div>
          <!--end::Accept/Reject Buttons-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>

    <!--begin::Main Content-->
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";

const { locale } = useI18n();

// Reactive state for collapsible details
const isDetailsOpen = ref(true);

// Toggle details visibility
const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

const route = useRoute();

// Mock data (updated with personal information)
const dataToShow = ref({
  id: route.params.user,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  city: "New York",
  country: "USA",
  degree: "Bachelor's in Computer Science",
  graduation_year: "2022",
  university: "University of XYZ",
  job_title: "Software Developer",
  company: "Tech Corp",
  department: "Engineering",
  job_description: "Developing web applications",
  skills: "JavaScript, Vue.js, Node.js",
  qualifications: "Certified Developer",
  references: { name: "Jane Doe", number: "987-654-3210" },
  resume: "https://example.com/resume.pdf",
  files: [
    { name: "Portfolio", url: "https://example.com/portfolio.pdf" },
    { name: "Certifications", url: "https://example.com/certifications.pdf" },
  ],
});

// Event handlers for accept/reject actions
const acceptRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to approve this request.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, approve it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/requests/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.ok) {
        Swal.fire({
          title: "Approved!",
          text: "The request has been approved successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to approve the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

const rejectRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to reject this request.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/requests/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.ok) {
        Swal.fire({
          title: "Rejected!",
          text: "The request has been rejected successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to reject the request.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "btn btn-primary" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};
</script>
<style scoped>
/* Base button styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Gradient animation */
.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%
  );
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
  z-index: 1;
  border-radius: 12px;
}

.btn:hover::before {
  background-position: -100% -100%;
}

/* Accept button */
.btn-accept {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  position: relative;
  z-index: 2;
}

.btn-accept:hover {
  background: linear-gradient(135deg, #81c784, #4caf50);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.btn-accept:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
}

/* Reject button */
.btn-reject {
  background: linear-gradient(135deg, #f44336, #e57373);
  color: white;
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
  position: relative;
  z-index: 2;
}

.btn-reject:hover {
  background: linear-gradient(135deg, #e57373, #f44336);
  box-shadow: 0 6px 12px rgba(244, 67, 54, 0.3);
  transform: translateY(-2px);
}

.btn-reject:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
}

/* Icon styles */
.btn i {
  font-size: 16px;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  color: white; /* Set icon color to white */
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5); /* Add a subtle glow */
}

/* Icon animation on hover */
.btn:hover i {
  transform: scale(1.2);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8); /* Increase glow on hover */
}

/* Pulse animation for icons */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-icon {
  animation: pulse 1.5s infinite;
}
</style>
