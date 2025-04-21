import { login } from "../../routeNames.js";

const token = localStorage.getItem('token');

const handleLogout = () => {
  if (!token) {
    alert('Aún no has iniciado sesión.');
    return;
  }
  const confirm= window.confirm('¿Estás seguro de que deseas cerrar sesión?');
  if (confirm) {
    localStorage.removeItem('token'); // O `localStorage.clear()` si tienes más datos
    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = login;
  }
};

export default handleLogout;