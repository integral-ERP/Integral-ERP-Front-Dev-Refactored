import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await AuthService.login(username, password);

      setMessage(loginResponse.message);
      setTimeout(() => {
        navigateTo('/dashboard');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (message) {
      const timerId = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timerId);
    }
  }, [message]);


  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login">
          <div className="login__field">
            <i className="login__icon fa fa-user"></i>
            <input
              type="text"
              className="login__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
            />
          </div>
          <div className="login__field">
            <i className="login__icon fas fa-lock"></i>
            <input
              type="password"
              className="login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>
            {message && <p>{message}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button login__submit" onClick={handleLogin}>
              <span className="button__text">Iniciar Sesión</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
        </div>
        <div className="screen__background">
        <span className="screen__background__shape screen__background__shape4"></span>
        <span className="screen__background__shape screen__background__shape3"></span>
        <span className="screen__background__shape screen__background__shape2"></span>
        <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
