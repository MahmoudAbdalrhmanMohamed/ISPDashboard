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
          :placeholder="$t('searchCategories')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div class="d-flex justify-content-end">
          <router-link
            :to="{ name: 'apps-categories-add' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addCategory") }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="false"
        ref="categoryTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Name Column -->
        <template v-slot:name="{ row: category }">{{
          category.name[locale]
        }}</template>

        <!-- Actions Column -->
        <template v-slot:actions="{ row: category }">
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
          >
            <div class="menu-item px-3">
              <router-link
                class="menu-link px-3 w-full"
                :to="`/apps/categories/update/${category.id}`"
              >
                {{ $t("edit") }}
              </router-link>
            </div>

            <div class="menu-item px-3">
              <a @click="deleteCategory(category.id)" class="menu-link px-3">{{
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
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import Datatable from "@/components/kt-datatable/KTDataTableV2.vue";

const load = ref(false);
const search = ref("");
const tableData = ref([]);
const initCategories = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch categories
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/categories?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initCategories.value = [...data.value.data.data];
    dataVal.value = data.value.data.meta.total;
    load.value = false;
  } catch (error) {
    load.value = false;
    console.error("Error fetching data:", error);
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
  { columnName: "name", columnLabel: "name", sortEnabled: true },
  { columnName: "actions", columnLabel: "actions", sortEnabled: false },
]);

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initCategories.value.filter((item) =>
      item.name.toLowerCase().includes(lowerSearch),
    );
  } else {
    tableData.value = [...initCategories.value];
  }
}, 300);

// Sort table data
const sort = ({ label, order }) => {
  const reverse = order === "desc";
  tableData.value.sort((a, b) => {
    const valueA = a[label] || "";
    const valueB = b[label] || "";
    return reverse
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });
};

// Delete category
const deleteCategory = async (id) => {
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
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      await fetching(1);
      Swal.fire("Deleted!", "The category has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
</script>
