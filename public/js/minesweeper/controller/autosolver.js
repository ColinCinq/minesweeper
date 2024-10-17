import * as game from "./gameplay.js";

const revealTime = 1000;

function displayAutoSolve(grid, coord, coordOrigin) {
  let cell = $(".square[data-x=" + coord[0] + "][data-y=" + coord[1] + "]"),
    cellOrigin = $(
      ".square[data-x=" + coordOrigin[0] + "][data-y=" + coordOrigin[1] + "]"
    ),
    time = revealTime;

  if (value != 0) {
    cell.text(value);
  } else {
    time = game.display0(grid, coord);
  }

  cellOrigin.addClass("autosolve-focus");
  cell.addClass("found");
  setTimeout(() => {
    cellOrigin.removeClass("autosolve-focus");
  }, time);

  if (grid.getUnrevealedCells().length == config.numberOfMines) winGame(grid);
}

export function singlePointEntry(grid, coord) {
  let flags = grid.getSurroundCells(coord, "flag"),
    unrelvealed = grid.getSurroundCells(coord, "unrevealed noflag"),
    value = grid.getCell(coord),
    newData = false;

  switch (value - flags.length) {
    case unrelvealed.length:
      unrelvealed.forEach((coordNeighbour) => {
        game.placeFlag(grid, coordNeighbour);
        newData = true;
      });
      break;
    case 0:
      unrelvealed.forEach((coordNeighbour) => {
        if (!grid.isRevealed(coordNeighbour)) {
          let value = grid.revealCell(coordNeighbour);
          game.displayCell(
            grid,
            $(
              ".square[data-x=" +
              coordNeighbour[0] +
              "][data-y=" +
              coordNeighbour[1] +
              "]"
            ),
            value
          );
          newData = true;
        }
      });
    default:
      break;
  }

  return newData;
}

export function recurSinglePointEntry(grid, coord) {
  let clusters = [getCluster(grid, coord)];

  clusters.forEach((cluster) => {
    let newData = false;
    do {
      cluster.forEach((coordCell) => {
        newData = singlePointEntry(grid, coordCell);
      });
    } while (newData);
  });
}

export function getCluster(grid, coord, cluster) {
  cluster = cluster ? cluster : [];

  if (!cluster.containsArray(coord)) cluster.push(coord);

  if (grid.isRevealed(coord)) {
    grid
      .getSurroundCells(coord, "unrevealed noflag")
      .forEach((coordNeighbour) => {
        if (!cluster.containsArray(coordNeighbour))
          getCluster(grid, coordNeighbour, cluster);
      });
  } else if (!grid.isFlag(coord)) {
    grid.getSurroundCells(coord, "revealed").forEach((coordNeighbour) => {
      if (!cluster.containsArray(coordNeighbour))
        getCluster(grid, coordNeighbour, cluster);
    });
  }

  return cluster.length > 1 ? cluster : [];
}
