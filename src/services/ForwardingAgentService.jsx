import axios from "axios";

class ForwardingAgentService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async createForwardingAgent(data) {
        const response = await axios.post(`${this.BASE_URL}forWardingAgents/`, data);
        return response;
      }
    
      async updateForwardingAgent(id, data) {
        const response = await axios.put(`${this.BASE_URL}forWardingAgents/${id}/`, data);
        return response;
      }
    
      async getForwardingAgents(){
        const response = await axios.get(`${this.BASE_URL}forWardingAgents/`);
        return response;
      }

      async getForwardingAgentById(id){
        const response = await axios.get(`${this.BASE_URL}forWardingAgents/${id}`);
        return response;
      }
    
      async deleteForwardingAgent(id) {
          const response = await axios.delete(`${this.BASE_URL}forWardingAgents/${id}/`);
          return response;
      }
}

export default new ForwardingAgentService();