<template>
  <div class="container mt-5">
    <h2>Add New Category</h2>

    <form @submit.prevent="addCategory">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label for="name" class="form-label">Category Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="category.name"
              required
            />
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <input
              type="text"
              class="form-control"
              id="description"
              v-model="category.description"
              placeholder="Optional"
            />
          </div>
        </div>

        <div class="col-md-12">
          <button type="submit" class="btn btn-primary">Add Category</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "CategoryCreate",
  data() {
    return {
      category: {
        name: "",
        description: "",
      },
    };
  },
  methods: {
    addCategory() {
      DataService.AddCategory(this.category)
        .then((response) => {
          console.log(response.data);
          alert("Category added successfully!");
          this.$router.push({ name: "category_list" });
        })
        .catch((e) => {
          console.log(e);
          alert("Failed to add category!");
        });
    },
  },
};
</script>
