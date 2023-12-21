const blockColorMap = {};

export const getRandomColor = (width, height) => {
  const sizeKey = `${width}_${height}`;

  if (blockColorMap[sizeKey]) {
    return blockColorMap[sizeKey];
  }

  const color = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;

  blockColorMap[sizeKey] = color;

  return color;
};
