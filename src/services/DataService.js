import http from "../http-common";

class DataService {
   login(data) {
    return http.post("/login", data);
  }

// ======= Category CRUD =======

  // Create category
  AddCategory(data) {
    return http.post("/categories", data);
  }

  // Get all categories
  CategoryList() {
    return http.get("/categories");
  }

  // Get single category
  GetCategory(id) {
    return http.get(`/categories/${id}`);
  }

  // Update category
  UpdateCategory(id, data) {
    return http.put(`/categories/${id}`, data);
  }

  // Delete category
  DeleteCategory(id) {
    return http.delete(`/categories/${id}`);
  }

// Products
  ProductList() {
  return http.get("/products");
}

SingleProduct(id) {
  return http.get(`/products/${id}`);
}

AddProduct(data) {
  return http.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
UpdateProduct(id, data) {
  // Use PUT for updating
  return http.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

DeleteProduct(id) {
  return http.delete(`/products/${id}`);
}


// ===== SUPPLIER CRUD =====
  SupplierList() {
    return http.get("/suppliers");
  }

  getSupplier(id) {
    return http.get(`/suppliers/${id}`);
  }

  createSupplier(data) {
    return http.post("/suppliers", data);
  }

  updateSupplier(id, data) {
    return http.put(`/suppliers/${id}`, data);
  }

  deleteSupplier(id) {
    return http.delete(`/suppliers/${id}`);
  }

}


export default new DataService();