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
                :src="dataToShow.image || '/media/temp.webp'"
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
              {{ dataToShow.fullname }}
            </a>
            <!--end::Name-->
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
              <!--begin::Suffix-->
              <div class="fw-bold mt-5">{{ $t("suffix") }}</div>
              <div class="text-gray-600">{{ dataToShow.suffix }}</div>
              <!--end::Suffix-->

              <!--begin::Email-->
              <div class="fw-bold mt-5">{{ $t("email") }}</div>
              <div class="text-gray-600">{{ dataToShow.email }}</div>
              <!--end::Email-->

              <!--begin::Phone-->
              <div class="fw-bold mt-5">{{ $t("phone") }}</div>
              <div class="text-gray-600">{{ dataToShow.phone }}</div>
              <!--end::Phone-->

              <!--begin::Interests-->
              <div class="fw-bold mt-5">{{ $t("interests") }}</div>
              <div class="flex mt-2 items-center gap-1 flex-wrap">
                <span
                  v-for="(sk, index) in dataToShow.interests"
                  :class="classes[index % classes.length]"
                  class="px-3 py-2 rounded text-white"
                  >{{ sk }}</span
                >
              </div>

              <!--end::Interests-->

              <!--begin::Position-->
              <div class="fw-bold mt-5">{{ $t("position") }}</div>
              <div class="text-gray-600">{{ dataToShow.position }}</div>
              <!--end::Position-->

              <!--begin::Company-->
              <div class="fw-bold mt-5">{{ $t("company") }}</div>
              <div class="text-gray-600">{{ dataToShow.company }}</div>
              <!--end::Company-->

              <!--begin::Message-->
              <div class="fw-bold mt-5">{{ $t("message") }}</div>
              <div class="text-gray-600">{{ dataToShow.message }}</div>
              <!--end::Message-->
            </div>
          </div>
          <!--end::Details content-->

          <!--begin::Accept/Reject Buttons-->
          <!-- <div class="flex items-center w-full mt-5">
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
          </div> -->
          <!--end::Accept/Reject Buttons-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>

    <!--begin::Loading State-->
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
const classes = ref([
  "bg-red-500",
  "bg-green-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-black",
]);
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const route = useRoute();

// Reactive state
const isDetailsOpen = ref(true);
const dataToShow = ref(null);
const loading = ref(false);

// Toggle details visibility
const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

// Fetch data from the backend
const fetchData = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/contacts/${route.params.id}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    if (data.status && data.data) {
      dataToShow.value = data.data;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to fetch contact details. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
      customClass: { confirmButton: "btn btn-primary" },
    });
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
});

// Accept Request
const acceptRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to approve this contact request.",
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
        `${import.meta.env.VITE_APP_API_URL_NEW}/contacts/${id}/approved`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve the request");
      }

      Swal.fire({
        title: "Approved!",
        text: "The contact request has been approved successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error approving request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while approving the request.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    }
  }
};

// Reject Request
const rejectRequest = async (id) => {
  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to reject this contact request.",
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
        `${import.meta.env.VITE_APP_API_URL_NEW}/contacts/${id}/rejected`,
        {
          method: "PATCH",
          headers: {
            "X-localization": locale.value,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject the request");
      }

      Swal.fire({
        title: "Rejected!",
        text: "The contact request has been rejected successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred while rejecting the request.",
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
