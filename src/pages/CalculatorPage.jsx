import React, { useState } from 'react';
import measurements from '../components/data/measurements.json';
import './CalculatorPage.css';
import { useUserContext } from '../context/userContext';
import { logger } from '../utils/logger';
import {
  calculateTravesanos,
  calculateLaterales,
  calculateFondos,
  calculateAutoGuideLength,
  calculateAutoDrawerHeight,
  calculateTravesanosAltura,
} from '../utils/calculations';
import { MeasurementForm, DrawerSettings, ResultList } from '../components/calculator';
import { Button, Typography } from '@mui/material';

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
      numDrawers: Math.round(parseInt(numDrawers, 10)),
      sideThickness: Math.round(parseFloat(sideThickness)),
      traverseThickness: Math.round(parseFloat(traverseThickness)),
      drawerThickness: Math.round(parseFloat(drawerThickness)),
      drawerHeight:
        drawerHeight === 'auto'
          ? calculateAutoDrawerHeight(
              Math.round(parseFloat(height)),
              Math.round(parseInt(numDrawers, 10)),
              Math.round(parseFloat(traverseThickness))
            )
          : Math.round(parseFloat(manualDrawerHeight)),
    };

    const predefinedMeasurements = measurements[type];
    const selectedGuideLength =
      guideLength === 'auto'
        ? calculateAutoGuideLength(
            userMeasurements.depth,
            predefinedMeasurements.optimalGuideLength
          )
        : Math.round(parseInt(guideLength, 10));

    const travesanos = calculateTravesanos(
      userMeasurements.width,
      predefinedMeasurements.resto,
      userMeasurements.numDrawers
    );
    const laterales = calculateLaterales(
      userMeasurements.depth,
      userMeasurements.numDrawers,
      selectedGuideLength,
      userMeasurements.drawerHeight
    );
    const fondos = calculateFondos(
      laterales.length,
      travesanos.length,
      drawerThickness,
      userMeasurements.numDrawers,
      userMeasurements.bottomThickness
    );
    const travesanosAltura = calculateTravesanosAltura(
      userMeasurements.drawerHeight,
      userMeasurements.bottomThickness,
      userMeasurements.numDrawers
    );

    const finalDrawerHeight =
      typeof userMeasurements.drawerHeight === 'object'
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

  return (
    <div className="calculator-container">
      <Typography variant="h2">Calculadora de Cajones</Typography>
      <MeasurementForm
        width={width}
        height={height}
        depth={depth}
        sideThickness={sideThickness}
        traverseThickness={traverseThickness}
        setWidth={setWidth}
        setHeight={setHeight}
        setDepth={setDepth}
        setSideThickness={setSideThickness}
        setTraverseThickness={setTraverseThickness}
      />
      <DrawerSettings
        type={type}
        setType={setType}
        guideLength={guideLength}
        setGuideLength={setGuideLength}
        numDrawers={numDrawers}
        setNumDrawers={setNumDrawers}
        bottomThickness={bottomThickness}
        setBottomThickness={setBottomThickness}
        drawerThickness={drawerThickness}
        setDrawerThickness={setDrawerThickness}
        drawerHeight={drawerHeight}
        setDrawerHeight={setDrawerHeight}
        manualDrawerHeight={manualDrawerHeight}
        setManualDrawerHeight={setManualDrawerHeight}
      />
      <Button variant="contained" onClick={handleCalculate}>
        Calcular
      </Button>
      {result && <ResultList result={result} numDrawers={numDrawers} />}
    </div>
  );
};

export default CalculatorPage;
