import http from "../http-common";

class DataService {
   login(data) {
    return http.post("/login", data);
  }
   register(data) {
    return http.post("/register", data);
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
  return http.post(`/products/${id}`, data, {
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

// ===== PURCHASE CRUD =====
PurchaseList() {
  return http.get("/purchases");
}

GetPurchase(id) {
  return http.get(`/purchases/${id}`);
}

AddPurchase(data) {
  return http.post("/purchases", data);
}

UpdatePurchase(id, data) {
  return http.put(`/purchases/${id}`, data);
}

DeletePurchase(id) {
  return http.delete(`/purchases/${id}`);
}


GetPurchaseInvoice(id) {
  return http.get(`/purchases/${id}/invoice`);
}

// ===== PURCHASE ITEM CRUD =====
PurchaseItemList() {
  return http.get("/purchase-items");
}

GetPurchaseItem(id) {
  return http.get(`/purchase-items/${id}`);
}

AddPurchaseItem(data) {
  return http.post("/purchase-items", data);
}

UpdatePurchaseItem(id, data) {
  return http.put(`/purchase-items/${id}`, data);
}

DeletePurchaseItem(id) {
  return http.delete(`/purchase-items/${id}`);
}

// ===== SALES CRUD =====
SaleList() {
  return http.get("/sales");
}

GetSale(id) {
  return http.get(`/sales/${id}`);
}

AddSale(data) {
  return http.post("/sales", data);
}

UpdateSale(id, data) {
  return http.put(`/sales/${id}`, data);
}

DeleteSale(id) {
  return http.delete(`/sales/${id}`);
}

// ===== SALE ITEM CRUD =====
SaleItemList() {
  return http.get("/sale-items");
}

GetSaleItem(id) {
  return http.get(`/sale-items/${id}`);
}

AddSaleItem(data) {
  return http.post("/sale-items", data);
}

UpdateSaleItem(id, data) {
  return http.put(`/sale-items/${id}`, data);
}

DeleteSaleItem(id) {
  return http.delete(`/sale-items/${id}`);
}

GetSaleInvoice(id) {
  return http.get(`/sales/${id}/invoice`);
}

// ===== CUSTOMER CRUD =====
CustomerList() {
  return http.get("/customers");
}

GetCustomer(id) {
  return http.get(`/customers/${id}`);
}

AddCustomer(data) {
  return http.post("/customers", data);
}

UpdateCustomer(id, data) {
  return http.put(`/customers/${id}`, data);
}

DeleteCustomer(id) {
  return http.delete(`/customers/${id}`);
}


// Employees
EmployeeList() {
  return http.get("/employees");
}

SingleEmployee(id) {
  return http.get(`/employees/${id}`);
}

AddEmployee(data) {
  return http.post("/employees", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
UpdateEmployee(id, data) {
  // Append _method=PUT for Laravel to recognize the request as PUT
  data.append('_method', 'PUT');
  return http.post(`/employees/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

DeleteEmployee(id) {
  return http.delete(`/employees/${id}`);
}

// ===== EXPENSE CRUD =====
ExpenseList() {
  return http.get("/expenses");
}

GetExpense(id) {
  return http.get(`/expenses/${id}`);
}

AddExpense(data) {
  return http.post("/expenses", data);
}

UpdateExpense(id, data) {
  return http.put(`/expenses/${id}`, data);
}

DeleteExpense(id) {
  return http.delete(`/expenses/${id}`);
}





// ===== REPORTS =====
  GetSalesReport(params) {
    return http.get("/reports/sales", { params });
  }

  GetExpenseReport(params) {
    return http.get("/reports/expenses", { params });
  }

  GetProfitLossReport(params) {
    return http.get("/reports/profit-loss", { params });
  }

  GetInventoryReport(params) {
    return http.get("/reports/inventory", { params });
  }
}







export default new DataService();