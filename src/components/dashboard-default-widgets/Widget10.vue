<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">{{
          $t("latestContacts")
        }}</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
          <!--begin::Table head-->
          <thead>
            <tr class="fs-7 fw-bold text-gray-500 border-bottom-0">
              <th
                class="p-0 pb-3 min-w-175px px-6"
                :class="locale === 'en' ? 'text-start' : 'text-end'"
              >
                {{ $t("fullname") }}
              </th>
              <th
                class="p-0 pb-3 min-w-100px"
                :class="locale === 'en' ? 'text-start' : 'text-end'"
              >
                {{ $t("email") }}
              </th>
              <th class="p-0 pb-3 min-w-100px">
                {{ $t("phone") }}
              </th>
              <th class="p-0 pb-3 min-w-100px">
                {{ $t("interests") }}
              </th>
              <th class="p-0 pb-3 w-50px text-end">{{ $t("view") }}</th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-if="contacts.length">
              <template v-for="contact in contacts" :key="contact.id">
                <tr>
                  <!-- Full Name Column -->
                  <td
                    class="p-0"
                    :class="locale === 'en' ? 'text-start' : 'text-end'"
                  >
                    <span class="text-base md:text-lg">{{
                      contact.fullname
                    }}</span>
                  </td>

                  <!-- Email Column -->
                  <td
                    class="p-0"
                    :class="locale === 'en' ? 'text-start' : 'text-end'"
                  >
                    <span class="text-base md:text-lg">{{
                      contact.email
                    }}</span>
                  </td>

                  <!-- Phone Column -->
                  <td class="p-0">
                    <span class="text-base md:text-lg">{{
                      contact.phone
                    }}</span>
                  </td>

                  <!-- Interests Column -->
                  <td class="p-0">
                    <div class="flex flex-wrap gap-1 items-center">
                      <span
                        v-for="(con, index) in contact.interests"
                        class="text-base px-2 py-1 rounded md:text-lg"
                        :class="classes[index % classes.length]"
                      >
                        {{ con }}
                      </span>
                    </div>
                  </td>

                  <!-- View Button Column -->
                  <td class="text-end p-0">
                    <router-link
                      :to="`/apps/contacts/${contact.id}`"
                      class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-30px h-30px"
                    >
                      <KTIcon
                        icon-name="black-right"
                        icon-class="fs-5 text-gray-700"
                      />
                    </router-link>
                  </td>
                </tr>
              </template>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" class="text-center py-6">
                  {{ $t("noData") }}
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end: Card Body-->
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
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();

defineProps({
  className: { type: String, required: false },
  contacts: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>
