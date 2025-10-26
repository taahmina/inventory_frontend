<template>
  <div class="container mt-5">
    <h2>Update Category</h2>
    <form @submit.prevent="updateCategory">
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
            <textarea
              class="form-control"
              id="description"
              v-model="category.description"
              rows="3"
              placeholder="Optional"
            ></textarea>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Update Category</button>
    </form>
  </div>
</template>

<script>
import DataService from "../../services/DataService";

export default {
  name: "CategoryEdit",
  data() {
    return {
      category: {
        name: "",
        description: "",
      },
    };
  },
  methods: {
    // Load existing category data by ID
    getCategory(id) {
      DataService.GetCategory(id)
        .then((res) => {
          if (res.data) this.category = res.data;
          else alert("Failed to load category");
        })
        .catch((e) => console.error(e));
    },

    // Update existing category
    updateCategory() {
      const id = this.$route.params.id;

      DataService.UpdateCategory(id, this.category)
        .then(() => {
          alert("Category updated successfully!");
          this.$router.push({ name: "category_list" });
        })
        .catch((e) => console.error(e));
    },
  },
  mounted() {
    const id = this.$route.params.id;
    if (id) this.getCategory(id);
  },
};
</script>
