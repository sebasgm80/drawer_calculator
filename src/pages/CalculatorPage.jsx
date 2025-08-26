import React, { useState } from 'react';
import measurements from '../components/data/measurements.json';
import { useUserContext } from '../hooks/useUserContext';
import { logger } from '../utils/logger';
import { Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

const CalculatorPage = () => {
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(500);
  const [depth, setDepth] = useState(450);
  const [bottomThickness, setBottomThickness] = useState(10);
  const [numDrawers, setNumDrawers] = useState(1);
  const [sideThickness, setSideThickness] = useState(16);
  const [traverseThickness, setTraverseThickness] = useState(19);
  const [drawerThickness, setDrawerThickness] = useState(16);
  const [type, setType] = useState('tandem16');
  const [guideLength, setGuideLength] = useState('auto');
  const [drawerHeight, setDrawerHeight] = useState('auto');
  const [manualDrawerHeight, setManualDrawerHeight] = useState(100);
  const [result, setResult] = useState(null);
  const { addResult } = useUserContext();

  const handleCalculate = () => {
    const userMeasurements = {
      width: Math.round(parseFloat(width)),
      height: Math.round(parseFloat(height)),
      depth: Math.round(parseFloat(depth)),
      bottomThickness: Math.round(parseFloat(bottomThickness)),
      numDrawers: Math.round(parseInt(numDrawers)),
      sideThickness: Math.round(parseFloat(sideThickness)),
      traverseThickness: Math.round(parseFloat(traverseThickness)),
      drawerThickness: Math.round(parseFloat(drawerThickness)),
      drawerHeight: drawerHeight === 'auto'
        ? calculateAutoDrawerHeight(Math.round(parseFloat(height)), Math.round(parseInt(numDrawers)), Math.round(parseFloat(traverseThickness)))
        : Math.round(parseFloat(manualDrawerHeight)),
    };

    const predefinedMeasurements = measurements[type];
    const selectedGuideLength = guideLength === 'auto'
      ? calculateAutoGuideLength(userMeasurements.depth, predefinedMeasurements.optimalGuideLength)
      : Math.round(parseInt(guideLength));

    const travesanos = calculateTravesanos(userMeasurements.width, predefinedMeasurements.resto, userMeasurements.numDrawers);
    const laterales = calculateLaterales(userMeasurements.depth, userMeasurements.numDrawers, selectedGuideLength, userMeasurements.drawerHeight);
    const fondos = calculateFondos(laterales.length, travesanos.length, drawerThickness, userMeasurements.numDrawers);
    const travesanosAltura = calculateTravesanosAltura(userMeasurements.drawerHeight, userMeasurements.bottomThickness, userMeasurements.numDrawers);

    const finalDrawerHeight = typeof userMeasurements.drawerHeight === 'object'
      ? JSON.stringify(userMeasurements.drawerHeight)
      : userMeasurements.drawerHeight;

    const newResult = {
      ...userMeasurements,
      drawerHeight: finalDrawerHeight,
      selectedGuideLength,
      travesanos,
      laterales,
      fondos,
      travesanosAltura,
      resto: predefinedMeasurements.resto,
    };

    setResult(newResult);
    logger('Adding Result:', newResult);
    addResult(newResult);
  };

  const calculateTravesanos = (width, resto, numDrawers) => {
    const travesanoLength = Math.round(width - resto);
    const totalTravesanos = numDrawers >= 3 ? 4 + (numDrawers - 2) * 2 : numDrawers * 2;
    return {
      length: travesanoLength,
      total: totalTravesanos,
      thickness: 16, // Por defecto o según formulario
      height: 125 // Ejemplo, ajustar según necesidad
    };
  };

  const calculateLaterales = (depth, numDrawers, guideLength, drawerHeight) => {
    const lateralLength = Math.round(depth - 10);
    const totalLaterales = numDrawers >= 3 ? 4 + (numDrawers - 2) * 2 : numDrawers * 2;
    const effectiveLength = Math.round(Math.min(lateralLength, guideLength - 10));
    return {
      length: effectiveLength,
      total: totalLaterales,
      thickness: 16, // Por defecto o según formulario
      height: drawerHeight
    };
  };

  const calculateFondos = (lateralLength, travesanoLength, drawerThickness, numDrawers) => {
    const fondoLength = Math.round(travesanoLength + drawerThickness);
    const totalFondos = Math.round(numDrawers);
    return {
      length: lateralLength,
      width: fondoLength,
      total: totalFondos,
      thickness: bottomThickness // Según formulario
    };
  };

  const calculateAutoGuideLength = (depth, optimalGuideLengths) => {
    return Math.round(optimalGuideLengths.reduce((prev, curr) => {
      if (curr + 10 <= depth) {
        return Math.abs(curr - depth) < Math.abs(prev - depth) ? curr : prev;
      }
      return prev;
    }));
  };

  const calculateAutoDrawerHeight = (height, numDrawers, traverseThickness) => {
    const marginSuperior = 10;
    const alturaGuia = 34 - 15; // 34 mm de la guía - 15 mm adicionales
    if (numDrawers === 1) {
      return Math.round(height - marginSuperior - alturaGuia);
    } else if (numDrawers === 2) {
      const halfHeight = Math.round(height / 2);
      return Math.round(halfHeight - marginSuperior - alturaGuia);
    } else {
      const adjustedHeight = Math.round(height + traverseThickness * 2);
      const divisionHeight = Math.round(adjustedHeight / 3);
      const topBottomHeight = Math.round(divisionHeight - traverseThickness);
      const centralHeight = Math.round(divisionHeight);

      return {
        topBottomHeight: Math.round(topBottomHeight - marginSuperior - alturaGuia),
        centralHeight: Math.round(centralHeight - marginSuperior - alturaGuia),
      };
    }
  };

  const calculateTravesanosAltura = (drawerHeight, bottomThickness, numDrawers) => {
    if (numDrawers < 3) {
      return Math.round(drawerHeight - 15 - bottomThickness);
    } else {
      const { topBottomHeight, centralHeight } = drawerHeight;
      const topBottomTravesanosAltura = Math.round(topBottomHeight - 15 - bottomThickness);
      const centralTravesanosAltura = Math.round(centralHeight - 15 - bottomThickness);
      return {
        topBottomTravesanosAltura,
        centralTravesanosAltura,
      };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 1, maxWidth: 1200, m: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Calculadora de Cajones</Typography>
      <Box component="section" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Mueble</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' }, gap: 2 }}>
          <TextField label="Ancho interior mueble en mm" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          <TextField label="Alto interior mueble en mm" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          <TextField label="Profundidad del mueble en mm" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
          <TextField label="Grueso de los laterales (montante) en mm" type="number" value={sideThickness} onChange={(e) => setSideThickness(e.target.value)} />
          <TextField label="Grueso de los travesaños en mm" type="number" value={traverseThickness} onChange={(e) => setTraverseThickness(e.target.value)} />
        </Box>
      </Box>
      <Box component="section" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Cajones</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' }, gap: 2 }}>
          <FormControl>
            <InputLabel>Tipo</InputLabel>
            <Select value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
              <MenuItem value="tandem16">Tandem 16</MenuItem>
              <MenuItem value="tandem19">Tandem 19</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Largo de Guía</InputLabel>
            <Select value={guideLength} label="Largo de Guía" onChange={(e) => setGuideLength(e.target.value)}>
              <MenuItem value="auto">Auto</MenuItem>
              {[...Array(11)].map((_, i) => {
                const length = 250 + i * 50;
                return <MenuItem key={length} value={length}>{length} mm</MenuItem>;
              })}
            </Select>
          </FormControl>
          <TextField label="Número de cajones" type="number" value={numDrawers} min="1" onChange={(e) => setNumDrawers(e.target.value)} />
          <TextField label="Grueso del fondo del cajón en mm" type="number" value={bottomThickness} onChange={(e) => setBottomThickness(e.target.value)} />
          <FormControl>
            <InputLabel>Grueso del cajón en mm</InputLabel>
            <Select value={drawerThickness} label="Grueso del cajón en mm" onChange={(e) => setDrawerThickness(e.target.value)}>
              <MenuItem value="16">16 mm</MenuItem>
              <MenuItem value="19">19 mm</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Altura lateral cajón</InputLabel>
            <Select value={drawerHeight} label="Altura lateral cajón" onChange={(e) => setDrawerHeight(e.target.value)}>
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>
          {drawerHeight === 'manual' && (
            <TextField label="Altura manual" type="number" value={manualDrawerHeight} onChange={(e) => setManualDrawerHeight(e.target.value)} />
          )}
        </Box>
      </Box>
      <Button variant="contained" onClick={handleCalculate}>Calcular</Button>
      {result && (
        <Box className="calculator-result" sx={{ mt: 3 }}>
          <Typography variant="h6">Resultados:</Typography>
          {numDrawers < 3 ? (
            <>
              <Box>
                <Typography variant="subtitle1">Travesaños:</Typography>
                <Typography>{result.travesanos.total} de {result.travesanos.length} x {result.travesanosAltura} x {result.travesanos.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Laterales:</Typography>
                <Typography>{result.laterales.total} de {result.laterales.length} x {result.drawerHeight} x {result.laterales.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Fondos:</Typography>
                <Typography>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</Typography>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Typography variant="subtitle1">Travesaños superior/inferior:</Typography>
                <Typography>4 de {result.travesanos.length} x {result.travesanosAltura.topBottomTravesanosAltura} x {result.travesanos.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Laterales superior/inferior:</Typography>
                <Typography>4 de {result.laterales.length} x {result.drawerHeight.topBottomHeight} x {result.laterales.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Travesaños centrales:</Typography>
                <Typography>{result.travesanos.total - 4} de {result.travesanos.length} x {result.travesanosAltura.centralTravesanosAltura} x {result.travesanos.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Laterales centrales:</Typography>
                <Typography>{result.laterales.total - 4} de {result.laterales.length} x {result.drawerHeight.centralHeight} x {result.laterales.thickness} mm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1">Fondos:</Typography>
                <Typography>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CalculatorPage;
