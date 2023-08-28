import axios from 'axios';

class AuthService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${this.BASE_URL}auth/login/`, {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", response.data);
        return { success: true, message: 'Successful login!' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Invalid username or password.');
    }
  }
}

export default new AuthService();
