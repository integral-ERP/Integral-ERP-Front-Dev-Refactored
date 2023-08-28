import axios from "axios";

class VendorService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createVendor(data) {
    const response = await axios.post(`${this.BASE_URL}vendor/`, data);
    return response;
  }

  async updateVendor(id, data) {
    const response = await axios.put(`${this.BASE_URL}vendor/${id}/`, data);
    return response;
  }

  async getVendors(){
    const response = await axios.get(`${this.BASE_URL}vendor/`);
    return response;
  }

  async deleteVendor(id) {
      const response = await axios.delete(`${this.BASE_URL}vendor/${id}/`);
      return response;
  }
}

export default new VendorService();