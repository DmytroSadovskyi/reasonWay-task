let blocks;

fetch("./blocks.json")
  .then((response) => response.json())
  .then((data) => {
    blocks = data;
    updateUI();
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function calculateFullness(blocks, container) {
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
    let rotatedBlock = { ...block };
    let rotation = 0;

    if (block.width > container.width || block.height > container.height) {
      [rotatedBlock.width, rotatedBlock.height] = [
        rotatedBlock.height,
        rotatedBlock.width,
      ];
      rotation = 90;
    }

    let fits = false;

    while (!fits && !containerFull) {
      fits = true;

      for (const placedBlock of blockCoordinates) {
        if (
          !(
            x + rotatedBlock.width <= placedBlock.left ||
            x >= placedBlock.right ||
            y + rotatedBlock.height <= placedBlock.top ||
            y >= placedBlock.bottom
          )
        ) {
          fits = false;
          break;
        }
      }

      if (!fits) {
        x += 10;

        if (x + rotatedBlock.width > container.width) {
          x = 0;
          y += 10;

          if (y + rotatedBlock.height > container.height) {
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
        right: x + rotatedBlock.width,
        bottom: y + rotatedBlock.height,
        initialOrder: index,
        rotation,
        color: getRandomColor(rotatedBlock.width, rotatedBlock.height),
      });

      x += 10;

      if (x + rotatedBlock.width > container.width) {
        x = 0;
        y += 10;

        if (y + rotatedBlock.height > container.height) {
          containerFull = true;
        }
      }
    }
  });

  // Calculate fullness
  const totalArea = container.width * container.height;
  const filledArea = blockCoordinates.reduce(
    (acc, block) =>
      acc + (block.right - block.left) * (block.bottom - block.top),
    0
  );
  const emptyArea = totalArea - filledArea;

  console.log("Total Area:", totalArea);
  console.log("Filled Area:", filledArea);
  console.log("Empty Area:", emptyArea);

  const fullness = 1 - emptyArea / totalArea;

  return { fullness, blockCoordinates };
}

let containerSize = { width: 350, height: 300 };

const blockColorMap = {};

function getRandomColor(width, height) {
  const sizeKey = `${width}_${height}`;

  if (blockColorMap[sizeKey]) {
    return blockColorMap[sizeKey];
  }

  const color = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;

  blockColorMap[sizeKey] = color;

  return color;
}

function updateUI() {
  const { fullness, blockCoordinates } = calculateFullness(
    blocks,
    containerSize
  );
  console.log("Fullness:", fullness);
  console.log("Block Coordinates:", blockCoordinates);

  const containerElement = document.getElementById("container");
  containerElement.innerHTML = "";

  const fullnessElement = document.querySelector(".fullness-info");
  fullnessElement.textContent = `Fullness: ${fullness.toFixed(2)}`;

  blockCoordinates.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.className = "block";
    blockElement.style.width = block.right - block.left + "px";
    blockElement.style.height = block.bottom - block.top + "px";
    blockElement.style.top = block.top + "px";
    blockElement.style.left = block.left + "px";
    blockElement.style.background = block.color;
    blockElement.style.border = "1px solid black";
    blockElement.textContent = block.initialOrder.toString();
    blockElement.style.transform = `rotate(${block.rotation}deg)`;
    containerElement.appendChild(blockElement);
  });
}

window.addEventListener("resize", () => {
  const newContainerWidth = window.innerWidth;
  const newContainerHeight = window.innerHeight;

  containerSize = { width: newContainerWidth, height: newContainerHeight };

  updateUI();
});
