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
  
ProductList() { return http.get("/products"); }
SingleProduct(id) { return http.get(`/products/${id}`); }
AddProduct(data) { return http.post("/products", data); }
UpdateProduct(id, data) { return http.post(`/products/${id}`, data, { headers: {'Content-Type':'multipart/form-data'}}); }
DeleteProduct(id) { return http.delete(`/products/${id}`); }



}


export default new DataService();