<template>
  <div class="gallery-container">
    <!-- Search Bar -->
    <div class="search-bar">
      <KTIcon icon-name="magnifier" icon-class="fs-1" />
      <input
        type="text"
        v-model="search"
        @input="debouncedSearch"
        class="form-control"
        :placeholder="$t('searchProducts')"
      />
    </div>

    <!-- Gallery Grid -->
    <div class="gallery-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="gallery-item"
      >
        <img :src="product.image" alt="Product Image" class="product-image" />
        <div class="gallery-info">
          <h3>{{ product.name }}</h3>
          <button class="btn btn-danger" @click="deleteProduct(product.id)">
            {{ $t("delete") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";

const search = ref("");
const fakeProducts = ref([
  { id: 1, name: "Product 1", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Product 2", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Product 3", image: "https://via.placeholder.com/150" },
]);
const filteredProducts = ref([...fakeProducts.value]);

const debouncedSearch = debounce(() => {
  if (search.value) {
    const lowerSearch = search.value.toLowerCase();
    filteredProducts.value = fakeProducts.value.filter((item) =>
      item.name.toLowerCase().includes(lowerSearch),
    );
  } else {
    filteredProducts.value = [...fakeProducts.value];
  }
}, 300);

const deleteProduct = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      filteredProducts.value = filteredProducts.value.filter(
        (product) => product.id !== id,
      );
      Swal.fire("Deleted!", "The product has been deleted.", "success");
    }
  });
};
</script>

<style>
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
}
.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}
.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
