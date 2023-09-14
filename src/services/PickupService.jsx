import axios from "axios";

class PickupService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPickup(data) {
    const response = await axios.post(`${this.BASE_URL}pickUpOrder/`, data);
    return response;
  }

  async updatePickup(id, data) {
    const response = await axios.put(`${this.BASE_URL}pickUpOrder/${id}/`, data);
    return response;
  }

  async getPickups(url = null){
    const apiUrl = url || `${this.BASE_URL}pickUpOrder/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPickupById(id){
    const response = await axios.get(`${this.BASE_URL}pickUpOrder/${id}`);
    return response;
  }

  async deletePickup(id) {
      const response = await axios.delete(`${this.BASE_URL}pickUpOrder/${id}/`);
      return response;
  }
}

export default new PickupService();