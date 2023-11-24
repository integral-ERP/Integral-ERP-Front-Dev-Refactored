import axios from "axios";

class InvoicesService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createInvoice(data) {
    const response = await axios.post(`${this.BASE_URL}invoice/`, data);
    return response;
  }
 
  async updateInvoices(id, data) {
    const response = await axios.put(`${this.BASE_URL}invoice/${id}/`, data);
    return response;
  }

  async getInvoices(url = null) {
    const apiUrl = url || `${this.BASE_URL}invoice/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getInvoiceById(id){
    const response = await axios.get(`${this.BASE_URL}invoice/${id}`);
    return response;
  }

  async deleteInvoice(id) {
      const response = await axios.delete(`${this.BASE_URL}invoice/${id}/`);
      return response;
  }
}

export default new InvoicesService();