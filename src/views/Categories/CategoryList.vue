<template>
  <div class="container mt-5">
    <h3><strong>All Categories</strong></h3>
    <router-link to="/add_category" class="btn btn-primary mb-3">Add New Category</router-link>
    <div class="row">
      <div class="col-12">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#SL</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categoryData" :key="category.id">
              <td>{{ index + 1 }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.description || '—' }}</td>
              <td>
                <router-link
                  :to="'/edit_category/' + category.id"
                  class="btn btn-sm btn-primary me-2"
                >
                  Edit
                </router-link>
                <button
                  @click="deleteCategory(category.id)"
                  class="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "CategoryList",
  data() {
    return {
      categoryData: [],
    };
  },
  methods: {
    // Fetch all categories
    getCategories() {
      DataService.CategoryList()
        .then((response) => {
          if (response.data) {
            this.categoryData = response.data;
          } else {
            alert(response.data.error || "Failed to load categories");
          }
        })
        .catch((e) => console.error(e));
    },

    // Delete a category
    deleteCategory(id) {
      if (!confirm("Are you sure you want to delete this category?")) return;

      DataService.DeleteCategory(id)
        .then(() => {
          alert("Category deleted successfully!");
          this.getCategories(); // Refresh after delete
        })
        .catch((e) => console.error(e));
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>
