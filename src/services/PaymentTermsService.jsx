import axios from "axios";

class PaymentTermsService{
  constructor(){ 
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPaymentTerm(data) {
    const response = await axios.post(`${this.BASE_URL}paymentTerms/`, data);
    return response;
  }

  async updatePaymentTerm(id, data) {
    const response = await axios.put(`${this.BASE_URL}paymentTerms/${id}/`, data);
    return response;
  }

  async getPaymentTerms(url = null) {
    const apiUrl = url || `${this.BASE_URL}paymentTerms/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPaymentTermById(id){
    const response = await axios.get(`${this.BASE_URL}paymentTerms/${id}`);
    return response;
  }

  async deletePaymentTerm(id) {
      const response = await axios.delete(`${this.BASE_URL}paymentTerms/${id}/`);
      return response;
  }
}

export default new PaymentTermsService();