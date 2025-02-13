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
          :placeholder="$t('searchProducts')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="flex justify-content-end flex-wrap gap-2"
          data-kt-customer-table-toolbar="base"
        >
          <!-- Add Product Button -->
          <router-link
            :to="{ name: 'apps-products-add' }"
            class="btn btn-primary"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addProduct") }}
          </router-link>
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
            @click="deleteSelectedProducts"
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
        ref="productTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Name Column -->
        <template v-slot:name="{ row: product }">{{
          product.name[locale]
        }}</template>
        <!-- Description Column -->
        <template v-slot:description="{ row: product }">{{
          product.description[locale]
        }}</template>
        <template v-slot:im="{ row: product }">
          <img
            :src="product.image || '/path/to/default-image.jpg'"
            alt="Product Image"
            class="product-image"
            width="50"
            height="50"
          />
        </template>
        <!-- Country Column -->
        <!-- <template v-slot:country="{ row: product }">{{
          product.country
        }}</template> -->
        <!-- Categories Column -->
        <template v-slot:categories="{ row: product }">
          <div class="flex gap-1 items-center">
            <span
              :class="classes[index % classes.length]"
              class="rounded-md px-2 py-1 flex-wrap text-white"
              v-for="(cat, index) in product.category"
              :key="index"
            >
              {{ cat.name[locale] }}
            </span>
          </div>
        </template>
        <!-- Actions Column -->
        <template v-slot:actions="{ row: product }">
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
                :to="`/apps/products/update/${product.id}`"
              >
                {{ $t("edit") }}
              </router-link>
            </div>

            <div class="menu-item px-3">
              <a @click="deleteProduct(product.id)" class="menu-link px-3">{{
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
const classes = ref([
  "bg-red-500",
  "bg-green-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-black",
]);
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
const initProducts = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch products
const fetching = async (page = 1) => {
  try {
    load.value = true;

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/products?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    tableData.value = [...data.value.data.data];
    initProducts.value = [...data.value.data.data];
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
  {
    columnName: "name",
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 100,
  },
  {
    columnName: "image",
    columnLabel: "im",
    sortEnabled: false,
    columnWidth: 120,
  },
  {
    columnName: "description",
    columnLabel: "description",
    sortEnabled: true,
    columnWidth: 150,
  },
  // { columnName: "country", columnLabel: "country", sortEnabled: true },
  {
    columnName: "categories",
    columnLabel: "categories",
    sortEnabled: false,
    columnWidth: 180,
  },
  {
    columnName: "actions",
    columnLabel: "actions",
    sortEnabled: false,
    columnWidth: 100,
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
    tableData.value = initProducts.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initProducts.value];
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

// Delete product
const deleteProduct = async (id) => {
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
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      await fetching(1);
      Swal.fire("Deleted!", "The product has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

// Delete selected products
const deleteSelectedProducts = async () => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      // Loop through each selected ID and send a DELETE request
      for (const id of selectedIds.value) {
        await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/products/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
      }

      // Refresh the product list after deletion
      await fetching(1);
      selectedIds.value = []; // Clear selected items

      Swal.fire(
        "Deleted!",
        "The selected products have been deleted.",
        "success",
      );
    }
  } catch (error) {
    console.error("Error deleting selected products:", error);
  }
};
</script>
<style>
.product-image {
  object-fit: cover;
  border-radius: 50%;
  max-width: 50px;
  max-height: 50px;
}
</style>
