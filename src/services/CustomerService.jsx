import axios from "axios";

class CustomerService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async getCustomers(){
        const response = await axios.get(`${this.BASE_URL}customer/`)
        return response;
    }

    async createCustomer(data){
        const response = await axios.post(`${this.BASE_URL}customer/`, data);
    return response;
    }

    async updateCustomer(id,data){
        const response = await axios.put(`${this.BASE_URL}customer/${id}/`, data);
    return response;
    }

    async deleteCustomer(id){
        const response = await axios.delete(`${this.BASE_URL}customer/${id}/`);
      return response;
    }
}

export default new CustomerService();