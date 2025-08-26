import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from '../utils/bcrypt';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(password);
    const newUser = { username, password: hashedPassword };
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
    navigate('/login');
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <label>
          Nombre de usuario:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
