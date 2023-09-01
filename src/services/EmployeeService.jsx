import axios from "axios";

class EmployeeService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async createEmployee(data) {
        const response = await axios.post(`${this.BASE_URL}employee/`, data);
        return response;
      }
    
      async updateEmployee(id, data) {
        const response = await axios.put(`${this.BASE_URL}employee/${id}/`, data);
        return response;
      }
    
      async getEmployees(){
        const response = await axios.get(`${this.BASE_URL}employee/`);
        return response;
      }

      async getEmployeeById(id){
        const response = await axios.get(`${this.BASE_URL}employee/${id}`);
        return response;
      }
    
      async deleteEmployee(id) {
          const response = await axios.delete(`${this.BASE_URL}employee/${id}/`);
          return response;
      }
}

export default new EmployeeService();