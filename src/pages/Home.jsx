import "./Home.css"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-content">
      <section className="home-intro">
        <h2>Bienvenido a la Calculadora de Cajones</h2>
        <p>Esta aplicación te permite calcular las dimensiones y piezas necesarias para construir cajones de manera fácil y rápida.</p>
      </section>
      <section className="home-features">
        <h3>Características Principales</h3>
        <ul>
          <li>Calcula dimensiones precisas</li>
          <li>Guarda y gestiona tus configuraciones</li>
          <li>Fácil de usar</li>
          <li>Acceso desde cualquier dispositivo</li>
        </ul>
        </section>
        <section className="home-actions">
          <button onClick={() => navigate('/calculator')}>Empezar a Calcular</button>
          <button onClick={() => navigate('/register')}>Registrarse</button>
        </section>
    </div>
  )
}

export default Home
