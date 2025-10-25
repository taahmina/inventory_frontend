import http from "../http-common";

class DataService {
   login(data) {
    return http.post("/login", data);
  }
}

export default new DataService();