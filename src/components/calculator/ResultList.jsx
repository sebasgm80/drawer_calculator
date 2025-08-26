import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const ResultList = ({ result, numDrawers }) => (
  <div className="calculator-result">
    <Typography variant="h3">Resultados:</Typography>
    {numDrawers < 3 ? (
      <List>
        <ListItem>
          <ListItemText
            primary="Travesaños"
            secondary={`${result.travesanos.total} de ${result.travesanos.length} x ${result.travesanosAltura} x ${result.travesanos.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Laterales"
            secondary={`${result.laterales.total} de ${result.laterales.length} x ${result.drawerHeight} x ${result.laterales.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Fondos"
            secondary={`${result.fondos.total} de ${result.fondos.length} x ${result.fondos.width} x ${result.fondos.thickness} mm`}
          />
        </ListItem>
      </List>
    ) : (
      <List>
        <ListItem>
          <ListItemText
            primary="Travesaños superior/inferior"
            secondary={`4 de ${result.travesanos.length} x ${result.travesanosAltura.topBottomTravesanosAltura} x ${result.travesanos.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Laterales superior/inferior"
            secondary={`4 de ${result.laterales.length} x ${result.drawerHeight.topBottomHeight} x ${result.laterales.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Travesaños centrales"
            secondary={`${result.travesanos.total - 4} de ${result.travesanos.length} x ${result.travesanosAltura.centralTravesanosAltura} x ${result.travesanos.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Laterales centrales"
            secondary={`${result.laterales.total - 4} de ${result.laterales.length} x ${result.drawerHeight.centralHeight} x ${result.laterales.thickness} mm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Fondos"
            secondary={`${result.fondos.total} de ${result.fondos.length} x ${result.fondos.width} x ${result.fondos.thickness} mm`}
          />
        </ListItem>
      </List>
    )}
  </div>
);

export default ResultList;
