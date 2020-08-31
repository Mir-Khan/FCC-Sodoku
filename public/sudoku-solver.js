const textArea = document.getElementById("text-input");
//import { puzzlesAndSolutions } from "./puzzle-strings.js";

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  textBoxChanged();
});

//the error box
let errorBox = document.querySelector("#error-msg");
//the textbox
let textbox = document.querySelector("#text-input");
//sodoku cell
let cells = document.querySelectorAll(".sudoku-input");
//buttons
let solveButton = document.querySelector("#solve-button");
let clearButton = document.querySelector("#clear-button");
//regex for condition 5
let inputReg = /^[1-9.]*$/;

let textBoxChanged = () => {
  //tests for errors
  errorBox.innerText = "";
  if (textbox.value.length != 81) {
    errorBox.innerText = "Error: Expected puzzle to be 81 characters long";
    return;
  }
  if (inputReg.test(textbox.value) === false) {
    errorBox.innerText = "Error: Invalid Characters";
    return;
  }

  //the values in the textbox are placed into the grid
  let textboxValues = textbox.value.split("");
  textboxValues.forEach((val, ind) => {
    cells[ind].value = val;
  });
};

let gridChanged = () => {
  //the following few lines changes the textbox accordingly to the grid
  let textString = "";
  cells.forEach(cell => {
    textString += cell.value.toString();
  });
  //checking if the input is alright
  errorBox.innerText = "";
  if (textString.length != 81) {
    errorBox.innerText = "Error: Expected puzzle to be 81 characters long";
    return;
  }

  if (inputReg.test(textString) === false) {
    errorBox.innerText = "Error: Invalid Characters";
    return;
  }

  textbox.value = textString;
};

// checking if you can place a number on a space on the board
let checkPlace = (board, row, col, val) => {
  //column  check
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === val) {
      return false;
    }
  }
  //row check
  for (let j = 0; j < 9; j++) {
    if (board[row][j] === val) {
      return false;
    }
  }
  //checks the 3 x 3 box the number is being placed in
  let topRow = parseInt(row / 3) * 3 + 3;
  let leftCol = parseInt(col / 3) * 3 + 3;
  for (let k = topRow; k < topRow; k++) {
    for (let l = leftCol; l < leftCol; l++) {
      if (board[k][l] === val) {
        return false;
      }
    }
  }

  //if all the tests failed, return true
  return true;
};

let solveFromCell = (board, row, col) => {
  //if it's the last column, move to the next row
  if (col === 9) {
    col = 0;
    row++;
  }
  //if it's the past the final row, return the board
  if (row === 9) {
    return board;
  }
  //if it's a period, move on to the next val
  if (board[row][col] !== ".") {
    return solveFromCell(board, row, col + 1);
  }
  //check what you can place in the current spot
  //numbers b/w 1-9 inclusively are placed, thus i = 1 and it's less than 10 for the duration of the loop
  for (let i = 1; i < 10; i++) {
    let cellVal = i.toString();
    if (checkPlace(board, row, col, cellVal)) {
      board[row][col] = cellVal;
      if (solveFromCell(board, row, col + 1)) {
        return solveFromCell(board, row, col + 1);
      } else {
        board[row][col] = ".";
      }
    }
  }

  //no solution was found
  return false;
};

//making the board
let sodokuBoard = vals => {
  let board = [[], [], [], [], [], [], [], [], []];
  let row = -1;
  for (let i = 0; i < vals.length; i++) {
    if (i % 9 === 0) {
      row += 1;
    }
    board[row].push(vals[i]);
  }
  return board;
};

//function for solving the puzzle
let solvePressed = () => {
  //solves the board when pressing the button
  let textBoxValues = textbox.value.split("");
  let board = sodokuBoard(textBoxValues);
  let solution = solveFromCell(board, 0, 0);
  errorBox.innerText = "";
  if (solution === false) {
    errorBox.innerText = "No solution could be found";
    return;
  }
  //also updates the string in the textbox after it's been solved
  let solutionString = "";
  for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution[i].length; j++) {
      solutionString += solution[i][j].toString();
    }
  }
  textbox.value = solutionString;
  textBoxChanged();
};
//textbox event
textbox.oninput = textBoxChanged;

//event for the grid updating
cells.forEach(element => {
  element.oninput = gridChanged;
});

//event listener for solveButton
solveButton.onclick = solvePressed;

//clear button event
clearButton.onclick = () => {
  textbox.value = "";
  cells.forEach(cell => {
    cell.value = "";
  });
};
try {
  module.exports = {};
} catch (e) {}
