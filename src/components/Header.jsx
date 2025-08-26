import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const menuItems = (
    <>
      <MenuItem component={Link} to="/" onClick={closeMenu}>Inicio</MenuItem>
      <MenuItem component={Link} to="/calculator" onClick={closeMenu}>Calculadora</MenuItem>
      <MenuItem component={Link} to="/list" onClick={closeMenu}>Mis Proyectos</MenuItem>
      {!user ? (
        <>
          <MenuItem component={Link} to="/register" onClick={closeMenu}>Registrarse</MenuItem>
          <MenuItem component={Link} to="/login" onClick={closeMenu}>Iniciar Sesión</MenuItem>
        </>
      ) : (
        <MenuItem onClick={() => { closeMenu(); handleLogout(); }}>Salir</MenuItem>
      )}
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Calculadora de Cajones
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={Link} to="/" color="inherit">Inicio</Button>
          <Button component={Link} to="/calculator" color="inherit">Calculadora</Button>
          <Button component={Link} to="/list" color="inherit">Mis Proyectos</Button>
          {!user ? (
            <>
              <Button component={Link} to="/register" color="inherit">Registrarse</Button>
              <Button component={Link} to="/login" color="inherit">Iniciar Sesión</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>Salir</Button>
          )}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={openMenu}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
            {menuItems}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
