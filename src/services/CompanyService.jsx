import axios from "axios";

class CompanyService{
    constructor() {
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async getAddress(){
        const response= await  axios(`${this.BASE_URL}addressInfo/`);
        return response;
    }
}

export default new CompanyService();