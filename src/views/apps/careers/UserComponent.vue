<template>
  <div class="flex flex-col">
    <div v-if="dataToShow" class="flex-column flex-lg-row-auto w-full mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body pt-15">
          <div class="d-flex flex-center flex-column mb-5">
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img
                :src="dataToShow.image || '/media/temp.webp'"
                alt="image"
                class="rounded-full w-[100px] h-[100px]"
              />
            </div>
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.fullname }}
            </a>
          </div>

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

          <div v-if="isDetailsOpen" id="kt_comic_user_details">
            <div class="py-5 fs-6">
              <div class="fw-bold mt-5">{{ $t("email") }}</div>
              <div class="text-gray-600">{{ dataToShow.email }}</div>

              <div class="fw-bold mt-5">{{ $t("phone") }}</div>
              <div class="text-gray-600">{{ dataToShow.phone }}</div>

              <div class="fw-bold mt-5">{{ $t("country") }}</div>
              <div class="text-gray-600">{{ dataToShow.country }}</div>

              <div class="fw-bold mt-5">{{ $t("city") }}</div>
              <div class="text-gray-600">{{ dataToShow.city }}</div>

              <div class="fw-bold mt-5">{{ $t("degree") }}</div>
              <div class="text-gray-600">{{ dataToShow.degree }}</div>

              <div class="fw-bold mt-5">{{ $t("university") }}</div>
              <div class="text-gray-600">{{ dataToShow.university }}</div>

              <div class="fw-bold mt-5">{{ $t("recent_job") }}</div>
              <div class="text-gray-600">{{ dataToShow.recent_job }}</div>

              <div class="fw-bold mt-5">{{ $t("company") }}</div>
              <div class="text-gray-600">{{ dataToShow.company }}</div>

              <div class="fw-bold mt-5">{{ $t("department") }}</div>
              <div class="text-gray-600">{{ dataToShow.department }}</div>

              <div class="fw-bold mt-5">{{ $t("description") }}</div>
              <div class="text-gray-600">{{ dataToShow.description }}</div>

              <div class="fw-bold mt-5">{{ $t("skills") }}</div>
              <div class="flex mt-2 items-center gap-1 flex-wrap">
                <span
                  v-for="(sk, index) in dataToShow.skills"
                  :class="classes[index % classes.length]"
                  class="px-3 py-2 rounded text-white"
                  >{{ sk }}</span
                >
              </div>

              <div class="fw-bold mt-5">{{ $t("qualifications") }}</div>
              <div class="flex mt-2 items-center gap-1 flex-wrap">
                <span
                  v-for="(sk, index) in dataToShow.qualifications"
                  :class="classes[index % classes.length]"
                  class="px-3 py-2 rounded text-white"
                  >{{ sk }}</span
                >
              </div>

              <div class="fw-bold mt-5">{{ $t("resume") }}</div>
              <a
                class="btn btn-accept me-2 w-fit mt-2"
                :href="dataToShow.resume"
                download
              >
                <i class="fas fa-check-circle me-2 pulse-icon"></i>
                {{ $t("downloadResume") }}
              </a>

              <div class="fw-bold mt-5">{{ $t("moreFiles") }}</div>
              <div class="flex gap-2 items-center flex-wrap">
                <a
                  v-for="file in dataToShow.files"
                  class="btn btn-accept me-2 w-fit mt-2"
                  :href="file"
                  download
                >
                  <i class="fas fa-check-circle me-2 pulse-icon"></i>
                  {{ $t("downloadResume") }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const classes = ref([
  "bg-red-500",
  "bg-green-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-black",
]);
const { locale } = useI18n();
const route = useRoute();

const isDetailsOpen = ref(true);
const dataToShow = ref(null);
const loading = ref(false);

const toggleDetails = () => {
  isDetailsOpen.value = !isDetailsOpen.value;
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/careers/${route.params.id}`,
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
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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
