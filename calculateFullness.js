// calculateFullness.js

import { getRandomColor } from "./getRandomColor.js";

export const calculateFullness = (
  blocks,
  container,
  rotateOnResize = false
) => {
  const sortedBlocks = blocks
    .slice()
    .sort((a, b) => b.width * b.height - a.width * a.height);
  const blockCoordinates = [];

  let x = 0;
  let y = 0;
  let containerFull = false;

  const blocksFit = sortedBlocks.every((block) => {
    return (
      (block.width <= container.width && block.height <= container.height) ||
      (block.height <= container.width && block.width <= container.height)
    );
  });

  if (!blocksFit) {
    return { fullness: 0, blockCoordinates: [] };
  }

  sortedBlocks.forEach((block, index) => {
    let rotation = 0;
    let rotatedWidth = block.width;
    let rotatedHeight = block.height;

    if (
      rotateOnResize &&
      (block.width > container.width || block.height > container.height)
    ) {
      [rotatedWidth, rotatedHeight] = [block.height, block.width];
      rotation = 90;
    }

    let fits = false;

    while (!fits && !containerFull) {
      fits = true;

      for (const placedBlock of blockCoordinates) {
        if (
          !(
            x + rotatedWidth <= placedBlock.left ||
            x >= placedBlock.right ||
            y + rotatedHeight <= placedBlock.top ||
            y >= placedBlock.bottom
          )
        ) {
          fits = false;
          break;
        }
      }

      if (!fits) {
        x += 10;

        if (x + rotatedWidth > container.width) {
          x = 0;
          y += 10;

          if (y + rotatedHeight > container.height) {
            containerFull = true;
            break;
          }
        }
      }
    }

    if (!containerFull) {
      blockCoordinates.push({
        top: y,
        left: x,
        right: x + rotatedWidth,
        bottom: y + rotatedHeight,
        initialOrder: index,
        rotation: rotation,
        color: getRandomColor(rotatedWidth, rotatedHeight),
      });

      x += 10;

      if (x + rotatedWidth > container.width) {
        x = 0;
        y += 10;

        if (y + rotatedHeight > container.height) {
          containerFull = true;
        }
      }
    }
  });

  const totalArea = container.width * container.height;
  const filledArea = blockCoordinates.reduce(
    (acc, block) =>
      acc + (block.right - block.left) * (block.bottom - block.top),
    0
  );
  const emptyArea = totalArea - filledArea;

  const fullness = 1 - emptyArea / totalArea;

  return { fullness, blockCoordinates };
};
