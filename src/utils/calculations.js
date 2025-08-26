export const calculateTravesanos = (width, resto, numDrawers) => {
  const travesanoLength = Math.round(width - resto);
  const totalTravesanos = numDrawers >= 3 ? 4 + (numDrawers - 2) * 2 : numDrawers * 2;
  return {
    length: travesanoLength,
    total: totalTravesanos,
    thickness: 16, // Por defecto o según formulario
    height: 125 // Ejemplo, ajustar según necesidad
  };
};

export const calculateLaterales = (depth, numDrawers, guideLength, drawerHeight) => {
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

export const calculateFondos = (lateralLength, travesanoLength, drawerThickness, numDrawers, bottomThickness) => {
  const fondoLength = Math.round(travesanoLength + drawerThickness);
  const totalFondos = Math.round(numDrawers);
  return {
    length: lateralLength,
    width: fondoLength,
    total: totalFondos,
    thickness: bottomThickness // Según formulario
  };
};

export const calculateAutoGuideLength = (depth, optimalGuideLengths) => {
  return Math.round(optimalGuideLengths.reduce((prev, curr) => {
    if (curr + 10 <= depth) {
      return Math.abs(curr - depth) < Math.abs(prev - depth) ? curr : prev;
    }
    return prev;
  }));
};

export const calculateAutoDrawerHeight = (height, numDrawers, traverseThickness) => {
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

export const calculateTravesanosAltura = (drawerHeight, bottomThickness, numDrawers) => {
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
