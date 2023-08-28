import axios from "axios";

class WarehouseProviderService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createWarehouseProvider(data) {
    const response = await axios.post(`${this.BASE_URL}wareHouseProviders/`, data);
    return response;
  }

  async updateWarehouseProvider(id, data) {
    const response = await axios.put(`${this.BASE_URL}wareHouseProviders/${id}/`, data);
    return response;
  }

  async getWarehouseProviders(){
    const response = await axios.get(`${this.BASE_URL}wareHouseProviders/`);
    return response;
  }

  async deleteWarehouseProvider(id) {
      const response = await axios.delete(`${this.BASE_URL}wareHouseProviders/${id}/`);
      return response;
  }
}

export default new WarehouseProviderService();