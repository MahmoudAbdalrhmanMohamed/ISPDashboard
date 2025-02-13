<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!-- Search Bar -->
      <div
        :class="locale === 'ar' ? 'flex-row-reverse' : ''"
        class="d-flex align-items-center position-relative my-1"
      >
        <KTIcon
          icon-name="magnifier"
          icon-class="fs-1 position-absolute ms-6"
        />
        <input
          type="text"
          v-model="search"
          @input="debouncedSearch"
          class="form-control form-control-solid w-250px ps-15"
          :placeholder="$t('searchCareers')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="flex justify-content-end flex-wrap gap-2"
          data-kt-customer-table-toolbar="base"
        >
          <!-- Add Career Button -->
          <!-- <router-link
            :to="{ name: 'apps-careers-add' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addCareer") }}
          </router-link> -->
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>
            {{ $t("selected") }}
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteSelectedCareers"
          >
            {{ $t("deleteSelected") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        :checkbox-enabled="true"
        checkbox-label="id"
        ref="careerTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- First Name Column -->
        <template v-slot:fullname="{ row: career }">{{
          career.fullname
        }}</template>
        <!-- Last Name Column -->

        <!-- Email Column -->
        <template v-slot:email="{ row: career }">{{ career.email }}</template>
        <!-- Phone Number Column -->
        <template v-slot:phone="{ row: career }">{{ career.phone }}</template>
        <!-- City Column -->
        <template v-slot:country="{ row: career }">{{
          career.country
        }}</template>
        <!-- Country Column -->
        <template v-slot:skills="{ row: career }">
          <div class="flex flex-wrap gap-1 items-center text-white">
            <span
              class="px-2 py-1 rounded"
              :class="classes[index % classes.length]"
              v-for="(i, index) in career.skills"
              >{{ i }}</span
            >
          </div>
          {{
        }}</template>
        <!-- Actions Column -->
        <template v-slot:actions="{ row: career }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ $t("actions") }}
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <div
            class="dropdown-menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
            aria-labelledby="dropdownMenuButton"
          >
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/careers/user/${career.id}`"
              >
                {{ $t("view") }}
              </router-link>
            </div>

            <div class="menu-item px-3">
              <a @click="deleteCareer(career.id)" class="menu-link px-3">{{
                $t("delete")
              }}</a>
            </div>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { Dropdown } from "bootstrap";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";

const load = ref(false);
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initCareers = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch careers
const fetching = async (page = 1) => {
  try {
    load.value = true;
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/careers?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initCareers.value = [...data.value.data.data];
    dataVal.value = data.value.data.meta.total;
    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching careers:", error);
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
  {
    columnName: "fullname",
    columnLabel: "fullname",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "email",
    columnLabel: "email",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "phone",
    columnLabel: "phone",
    columnWidth: 175,

    sortEnabled: true,
  },
  {
    columnName: "country",
    columnLabel: "country",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "skills",
    columnLabel: "skills",
    sortEnabled: true,
    columnWidth: 175,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 175,
  },
]);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initCareers.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initCareers.value];
  }
}, 300);

// Sort table data
const sort = ({ label, order }) => {
  const reverse = order === "desc";
  tableData.value.sort((a, b) => {
    const valueA = a[label] || ""; // Ensure there's a fallback if the label is undefined
    const valueB = b[label] || ""; // Ensure there's a fallback if the label is undefined

    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });
};

// Delete career
const deleteCareer = async (id) => {
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
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/careers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      await fetching(1);
      Swal.fire("Deleted!", "The career has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting career:", error);
  }
};

const deleteSelectedCareers = async () => {
  if (!selectedIds.value.length) return;

  const confirmResult = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${selectedIds.value.length} careers.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete them!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "btn btn-danger",
      cancelButton: "btn btn-secondary",
    },
  });

  if (confirmResult.isConfirmed) {
    try {
      await Promise.all(
        selectedIds.value.map((id) =>
          useFetch(`${import.meta.env.VITE_APP_API_URL_NEW}/careers/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }),
        ),
      );

      tableData.value = tableData.value.filter(
        (contact) => !selectedIds.value.includes(contact.id),
      );
      initCareers.value = initCareers.value.filter(
        (contact) => !selectedIds.value.includes(contact.id),
      );

      Swal.fire({
        title: "Deleted!",
        text: "The selected careers have been deleted.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-primary" },
      });
      selectedIds.value = [];
    } catch (error) {
      console.error("Error deleting selected careers:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete some careers. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  }
};
const classes = ref([
  "bg-red-500",
  "bg-green-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-black",
]);
</script>
