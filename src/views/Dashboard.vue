<template>
  <!--  -->
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-10 mb-5 xl:mb-10">
      <!-- Card 2 -->
      <Widget11
        :usersCount="dataVal.homelesses_count"
        :usersVerifiedCount="dataVal.homelesses_approved"
        :description="$t('produtcs')"
        tanslated="approved"
        bgColor="#430f58"
        className="h-full"
      />
      <Widget1
        :usersCount="565"
        :usersVerifiedCount="dataVal.categories_count"
        :description="$t('clients')"
        bgColor="#F1416C"
        :bgImage="getAssetPath('media/patterns/vector-1.png')"
        className="h-full pb-24"
      />
    </div>
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="w-full">
        <WidgetMoney
          :data="dataVal.homelesses"
          className="h-lg-100"
          :height="300"
        />
      </div>
    </div>

    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="w-full">
        <Widget10
          v-if="dataVal.homelesses_list.length"
          :workshops="dataVal.homelesses_list"
          className="h-md-100"
        />
      </div>
    </div>
  </div>
  <!-- <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div> -->
</template>

<script setup>
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import Widget11 from "@/components/dashboard-default-widgets/Widget1Progress.vue";

import WidgetMoney from "@/components/dashboard-default-widgets/WidgetMoney.vue";
import Widget10 from "@/components/dashboard-default-widgets/Widget10.vue";
import Widget1010 from "@/components/dashboard-default-widgets/Widget1010.vue";
import { useFetch } from "@vueuse/core";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getAssetPath } from "@/core/helpers/assets";

const router = useRouter();
const { locale } = useI18n();
const dataVal = ref(null);
const loading = ref(false);
const isFetching = ref(false); // Prevent concurrent API calls

const fetching = async () => {
  if (isFetching.value) return;

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No token found, redirecting to login.");
    // router.replace({ name: "sign-in" }); // Redirect to login if token is missing
    return;
  }

  isFetching.value = true;

  try {
    loading.value = true;

    console.log(`${import.meta.env.VITE_APP_API_URL_NEW}/dashboard`);
    const response = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/dashboard`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${authToken}`,
        },
      },
    ).json();

    if (response?.data.value?.status) {
      dataVal.value = response.data.value.data;
    } else if (response?.data.value?.message === "Unauthenticated") {
      console.warn("Unauthenticated, clearing token and redirecting.");
      // localStorage.removeItem("authToken");
      // router.replace({ name: "sign-in" });
    } else {
      throw new Error(response?.data.value?.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
    // localStorage.removeItem("authToken");
    // router.replace({ name: "sign-in" });
  } finally {
    loading.value = false;
    isFetching.value = false;
  }
};

// Initial fetch
fetching();

// Watch locale and refetch only when necessary
watch(
  () => locale.value,
  async () => {
    await fetching();
  },
);

dataVal.value = {
  homelesses_count: 4,
  homelesses_approved: 2,
  categories_count: 4,
  homelesses: [
    0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0,
  ],
  homelesses_list: [
    {
      id: 22,
      image:
        "https://shelter.el-doc.com/storage/homelesses/NB3vjBHrIjg0nOZ4aveGL0LoDB6ZAgQJ9Rnfcwu5.jpg",
      address: null,
      status: "approved",
    },
    {
      id: 21,
      image:
        "https://shelter.el-doc.com/storage/homelesses/SMPqd393RlCuyMHEcQVLDrGLgnadG9ANjDoXE7QJ.jpg",
      address: null,
      status: "pending",
    },
    {
      id: 20,
      image:
        "https://shelter.el-doc.com/storage/homelesses/SJ7SWrUazshSIxtVo0dPqqenKcOWC9y9fLKK7ffz.webp",
      address: null,
      status: "pending",
    },
    {
      id: 19,
      image:
        "https://shelter.el-doc.com/storage/homelesses/JeCdCzVbO0bnXSmI2A6KhTSQnxGDKYVIflVhPTsM.jpg",
      address: null,
      status: "approved",
    },
  ],
};
</script>
