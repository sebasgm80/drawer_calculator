import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const MeasurementForm = ({
  width,
  height,
  depth,
  sideThickness,
  traverseThickness,
  setWidth,
  setHeight,
  setDepth,
  setSideThickness,
  setTraverseThickness,
}) => (
  <div className="section">
    <Typography variant="h3">Mueble</Typography>
    <Grid container spacing={2} className="form-group">
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Ancho interior mueble en mm"
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Alto interior mueble en mm"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Profundidad del mueble en mm"
          type="number"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Grueso de los laterales (montante) en mm"
          type="number"
          value={sideThickness}
          onChange={(e) => setSideThickness(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Grueso de los travesaños en mm"
          type="number"
          value={traverseThickness}
          onChange={(e) => setTraverseThickness(e.target.value)}
          fullWidth
        />
      </Grid>
    </Grid>
  </div>
);

export default MeasurementForm;
