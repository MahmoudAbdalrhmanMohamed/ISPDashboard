<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div class="d-flex align-items-center position-relative my-1">
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-1 position-absolute ms-6"
        />
        <input
          type="text"
          v-model="search"
          @input="debouncedSearch"
          class="form-control form-control-solid w-250px ps-15"
          :placeholder="$t('searchImages')"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="imageTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Image Column -->
        <template v-slot:image="{ row: image }">
          <img
            :src="image.url || '/path/to/default-image.jpg'"
            alt="Gallery Image"
            class="gallery-image"
          />
        </template>

        <!-- Actions Column -->
        <template v-slot:actions="{ row: image }">
          <button class="btn btn-sm btn-danger" @click="deleteImage(image.id)">
            {{ $t("delete") }}
          </button>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";
import Swal from "sweetalert2";

const load = ref(false);
const search = ref("");
const tableData = ref([]);
const initImages = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch images
const fetching = async (page = 1) => {
  try {
    load.value = true;
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/gallery?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initImages.value = [...data.value.data.data];
    dataVal.value = data.value.data.meta.total;
    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching images:", error);
  }
};

// Fetch initial data
fetching(1);

// Watch locale and refetch data on change
watch(
  () => locale.value,
  () => fetching(1),
);

// Table header configuration
const tableHeader = ref([
  { columnName: "image", columnLabel: "image", sortEnabled: false },
  { columnName: "actions", columnLabel: "actions", sortEnabled: false },
]);

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initImages.value.filter((item) =>
      item.url.toLowerCase().includes(lowerSearch),
    );
  } else {
    tableData.value = [...initImages.value];
  }
}, 300);

// Delete Image
const deleteImage = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/gallery/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      await fetching(1);
      Swal.fire("Deleted!", "The image has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
</script>

<style>
.gallery-image {
  object-fit: cover;
  border-radius: 8px;
  width: 100px;
  height: 100px;
}
</style>
