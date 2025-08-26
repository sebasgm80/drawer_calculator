import React from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const DrawerSettings = ({
  type,
  setType,
  guideLength,
  setGuideLength,
  numDrawers,
  setNumDrawers,
  bottomThickness,
  setBottomThickness,
  drawerThickness,
  setDrawerThickness,
  drawerHeight,
  setDrawerHeight,
  manualDrawerHeight,
  setManualDrawerHeight,
}) => (
  <div className="section">
    <Typography variant="h3">Cajones</Typography>
    <Grid container spacing={2} className="form-group">
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Tipo</InputLabel>
          <Select value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
            <MenuItem value="tandem16">Tandem 16</MenuItem>
            <MenuItem value="tandem19">Tandem 19</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Largo de Guía</InputLabel>
          <Select value={guideLength} label="Largo de Guía" onChange={(e) => setGuideLength(e.target.value)}>
            <MenuItem value="auto">Auto</MenuItem>
            {[...Array(11)].map((_, i) => {
              const length = 250 + i * 50;
              return (
                <MenuItem key={length} value={length}>{`${length} mm`}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Número de cajones"
          type="number"
          value={numDrawers}
          onChange={(e) => setNumDrawers(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Grueso del fondo del cajón en mm"
          type="number"
          value={bottomThickness}
          onChange={(e) => setBottomThickness(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Grueso del cajón en mm</InputLabel>
          <Select
            value={drawerThickness}
            label="Grueso del cajón en mm"
            onChange={(e) => setDrawerThickness(e.target.value)}
          >
            <MenuItem value="16">16 mm</MenuItem>
            <MenuItem value="19">19 mm</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Altura lateral cajón</InputLabel>
          <Select
            value={drawerHeight}
            label="Altura lateral cajón"
            onChange={(e) => setDrawerHeight(e.target.value)}
          >
            <MenuItem value="auto">Auto</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
          </Select>
        </FormControl>
        {drawerHeight === 'manual' && (
          <TextField
            sx={{ mt: 2 }}
            type="number"
            label="Altura manual"
            value={manualDrawerHeight}
            onChange={(e) => setManualDrawerHeight(e.target.value)}
            fullWidth
          />
        )}
      </Grid>
    </Grid>
  </div>
);

export default DrawerSettings;
