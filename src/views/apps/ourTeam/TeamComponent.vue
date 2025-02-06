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
          :placeholder="$t('searchTeamMembers')"
        />
      </div>

      <!-- Toolbar -->
      <div class="card-toolbar">
        <div
          v-if="!selectedIds.length"
          class="flex justify-content-end flex-wrap gap-2"
          data-kt-customer-table-toolbar="base"
        >
          <!-- Add Team Member Button -->
          <router-link :to="{ name: 'apps-team-add' }" class="btn btn-primary">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            {{ $t("addTeamMember") }}
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
            @click="deleteSelectedTeamMembers"
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
        ref="teamTable"
        :totalPages="Number(dataVal)"
        @page-change="fetching"
        :loading="load"
      >
        <!-- Name Column -->
        <template v-slot:name="{ row: member }">{{ member.name }}</template>
        <!-- Image Column -->
        <template v-slot:image="{ row: member }">
          <img
            :src="member.image || '/path/to/default-image.jpg'"
            alt="Team Member Image"
            class="team-image"
            width="50"
            height="50"
          />
        </template>
        <!-- Role Column -->
        <template v-slot:role="{ row: member }">{{ member.role }}</template>
        <!-- Description Column -->
        <template v-slot:description="{ row: member }">
          {{ member.description }}
        </template>
        <!-- Contact Column -->
        <template v-slot:contact="{ row: member }">{{
          member.contact
        }}</template>
        <!-- LinkedIn Column -->
        <template v-slot:linkedin="{ row: member }">{{
          member.linkedin
        }}</template>
        <!-- Actions Column -->
        <template v-slot:actions="{ row: member }">
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
                :to="`/apps/team/update/${member.id}`"
              >
                {{ $t("edit") }}
              </router-link>
            </div>
            <div class="menu-item px-3">
              <a @click="deleteTeamMember(member.id)" class="menu-link px-3">
                {{ $t("delete") }}
              </a>
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
const selectedIds = ref([]);
const search = ref("");
const tableData = ref([]);
const initTeamMembers = ref([]);
const { locale } = useI18n();
const dataVal = ref();

// Fetch team members
const fetching = async (page = 1) => {
  try {
    load.value = true;
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/team?page=${page}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    // Assuming the API returns data in a similar structure to the products API:
    tableData.value = [...data.value.data.data];
    initTeamMembers.value = [...data.value.data.data];
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

// Table header configuration for team members
const tableHeader = ref([
  { columnName: "name", columnLabel: "name", sortEnabled: true },
  { columnName: "image", columnLabel: "image", sortEnabled: false },
  { columnName: "role", columnLabel: "role", sortEnabled: true },
  { columnName: "description", columnLabel: "description", sortEnabled: true },
  { columnName: "contact", columnLabel: "contact", sortEnabled: true },
  { columnName: "linkedin", columnLabel: "linkedin", sortEnabled: false },
  { columnName: "actions", columnLabel: "actions", sortEnabled: false },
]);

// Handle item selection
const onItemSelect = (selectedItems) => {
  selectedIds.value = selectedItems;
};

// Debounced search
const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    tableData.value = initTeamMembers.value.filter((item) =>
      Object.values(item).some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(lowerSearch),
      ),
    );
  } else {
    tableData.value = [...initTeamMembers.value];
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

// Delete team member
const deleteTeamMember = async (id) => {
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
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/team/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      await fetching(1);
      Swal.fire("Deleted!", "The team member has been deleted.", "success");
    }
  } catch (error) {
    console.error("Error deleting team member:", error);
  }
};

// Delete selected team members
const deleteSelectedTeamMembers = async () => {
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
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/team/delete-selected`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ ids: selectedIds.value }),
        },
      );
      await fetching(1);
      Swal.fire(
        "Deleted!",
        "The selected team members have been deleted.",
        "success",
      );
    }
  } catch (error) {
    console.error("Error deleting selected team members:", error);
  }
};
</script>

<style>
.team-image {
  object-fit: cover;
  border-radius: 50%;
  max-width: 50px;
  max-height: 50px;
}
</style>
