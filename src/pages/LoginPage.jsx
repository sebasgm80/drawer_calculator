import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import bcrypt from '../utils/bcrypt';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (registeredUser && registeredUser.username === username) {
      const isValid = await bcrypt.compare(password, registeredUser.password);

      if (isValid) {
        const user = { username: registeredUser.username };
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/calculator');
      } else {
        alert('Nombre de usuario o contraseña incorrectos');
      }
    } else {
      alert('Nombre de usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <label>
          Nombre de usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
