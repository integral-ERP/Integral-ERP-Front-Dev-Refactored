import axios from "axios";

class ChartOfAccountsSerice{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
      }

      async createChartOfAccountsSerice(data) {
        const response = await axios.post(`${this.BASE_URL}chartAccounts/`, data);
        return response;
      }
    
      async updateChartOfAccounts(id, data) {
        const response = await axios.put(`${this.BASE_URL}chartAccounts/${id}/`, data);
        return response;
      }
    
      async getChartOfAccounts(url = null) {
        const apiUrl = url || `${this.BASE_URL}chartAccounts/`;
        const response = await axios.get(apiUrl);
        return response;
      }
    
      async getChartOfAccountsId(id){
        const response = await axios.get(`${this.BASE_URL}chartAccounts/${id}`);
        return response;
      }
    
      async deleteChartOfAccounts(id) {
          const response = await axios.delete(`${this.BASE_URL}chartAccounts/${id}/`);
          return response;
      }
}
export default new ChartOfAccountsSerice();