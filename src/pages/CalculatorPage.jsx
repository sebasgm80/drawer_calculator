import React, { useState } from 'react';
import measurements from '../components/data/measurements.json';
import './CalculatorPage.css';
import { useUserContext } from '../hooks/useUserContext';
import { logger } from '../utils/logger';

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
    <div className="calculator-container">
      <h2>Calculadora de Cajones</h2>
      <div className="section">
        <h3>Mueble</h3>
        <div className="form-group">
          <label>
            Ancho interior mueble en mm:
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          </label>
          <label>
            Alto interior mueble en mm:
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </label>
          <label>
            Profundidad del mueble en mm:
            <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
          </label>
          <label>
            Grueso de los laterales (montante) en mm:
            <input type="number" value={sideThickness} onChange={(e) => setSideThickness(e.target.value)} />
          </label>
          <label>
            Grueso de los travesaños en mm:
            <input type="number" value={traverseThickness} onChange={(e) => setTraverseThickness(e.target.value)} />
          </label>
        </div>
      </div>
      <div className="section">
        <h3>Cajones</h3>
        <div className="form-group">
          <label>
            Tipo:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="tandem16">Tandem 16</option>
              <option value="tandem19">Tandem 19</option>
            </select>
          </label>
          <label>
            Largo de Guía:
            <select value={guideLength} onChange={(e) => setGuideLength(e.target.value)}>
              <option value="auto">Auto</option>
              {[...Array(11)].map((_, i) => {
                const length = 250 + i * 50;
                return <option key={length} value={length}>{length} mm</option>;
              })}
            </select>
          </label>
          <label>
            Número de cajones:
            <input type="number" value={numDrawers} min="1" onChange={(e) => setNumDrawers(e.target.value)} />
          </label>
          <label>
            Grueso del fondo del cajón en mm:
            <input type="number" value={bottomThickness} onChange={(e) => setBottomThickness(e.target.value)} />
          </label>
          <label>
            Grueso del cajón en mm:
            <select value={drawerThickness} onChange={(e) => setDrawerThickness(e.target.value)}>
              <option value="16">16 mm</option>
              <option value="19">19 mm</option>
            </select>
          </label>
          <label>
            Altura lateral cajón:
            <select value={drawerHeight} onChange={(e) => setDrawerHeight(e.target.value)}>
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
            {drawerHeight === 'manual' && (
              <input
                type="number"
                value={manualDrawerHeight}
                onChange={(e) => setManualDrawerHeight(e.target.value)}
              />
            )}
          </label>
        </div>
      </div>
      <button onClick={handleCalculate}>Calcular</button>
      {result && (
        <div className="calculator-result">
          <h3>Resultados:</h3>
          {numDrawers < 3 ? (
            <>
              <div>
                <h4>Travesaños:</h4>
                <p>{result.travesanos.total} de {result.travesanos.length} x {result.travesanosAltura} x {result.travesanos.thickness} mm</p>
              </div>
              <div>
                <h4>Laterales:</h4>
                <p>{result.laterales.total} de {result.laterales.length} x {result.drawerHeight} x {result.laterales.thickness} mm</p>
              </div>
              <div>
                <h4>Fondos:</h4>
                <p>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4>Travesaños superior/inferior:</h4>
                <p>4 de {result.travesanos.length} x {result.travesanosAltura.topBottomTravesanosAltura} x {result.travesanos.thickness} mm</p>
              </div>
              <div>
                <h4>Laterales superior/inferior:</h4>
                <p>4 de {result.laterales.length} x {result.drawerHeight.topBottomHeight} x {result.laterales.thickness} mm</p>
              </div>
              <div>
                <h4>Travesaños centrales:</h4>
                <p>{result.travesanos.total - 4} de {result.travesanos.length} x {result.travesanosAltura.centralTravesanosAltura} x {result.travesanos.thickness} mm</p>
              </div>
              <div>
                <h4>Laterales centrales:</h4>
                <p>{result.laterales.total - 4} de {result.laterales.length} x {result.drawerHeight.centralHeight} x {result.laterales.thickness} mm</p>
              </div>
              <div>
                <h4>Fondos:</h4>
                <p>{result.fondos.total} de {result.fondos.length} x {result.fondos.width} x {result.fondos.thickness} mm</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
