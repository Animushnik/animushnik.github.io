class Leontev {
  index = 0;
  matrix = [];
  Y = [];
  size;

  _arraySum(array) {
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum;
  }

  _diffMatrix(A, B) {
    var m = A.length,
      n = A[0].length,
      C = [];
    for (var i = 0; i < m; i++) {
      C[i] = [];
      for (var j = 0; j < n; j++) C[i][j] = A[i][j] - B[i][j];
    }
    return C;
  }

  _createE() {
    let res = [];
    for (let i = 0; i < L.size; i++) {
      let row = [];
      for (let k = 0; k < L.size; k++) {
        row.push(i == k ? 1 : 0);
      }
      res.push(row);
    }
    return res;
  }

  // Определитель матрицы
  _Determinant(A) {
    var N = A.length,
      B = [],
      denom = 1,
      exchanges = 0;
    for (var i = 0; i < N; ++i) {
      B[i] = [];
      for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
    }
    for (var i = 0; i < N - 1; ++i) {
      var maxN = i,
        maxValue = Math.abs(B[i][i]);
      for (var j = i + 1; j < N; ++j) {
        var value = Math.abs(B[j][i]);
        if (value > maxValue) {
          maxN = j;
          maxValue = value;
        }
      }
      if (maxN > i) {
        var temp = B[i];
        B[i] = B[maxN];
        B[maxN] = temp;
        ++exchanges;
      } else {
        if (maxValue == 0) return maxValue;
      }
      var value1 = B[i][i];
      for (var j = i + 1; j < N; ++j) {
        var value2 = B[j][i];
        B[j][i] = 0;
        for (var k = i + 1; k < N; ++k)
          B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
      }
      denom = value1;
    }
    if (exchanges % 2) return -B[N - 1][N - 1];
    else return B[N - 1][N - 1];
  }
  // Союзная матрица
  _AdjugateMatrix(A) {
    var N = A.length,
      adjA = [];
    for (var i = 0; i < N; i++) {
      adjA[i] = [];
      for (var j = 0; j < N; j++) {
        var B = [],
          sign = (i + j) % 2 == 0 ? 1 : -1;
        for (var m = 0; m < j; m++) {
          B[m] = [];
          for (var n = 0; n < i; n++) B[m][n] = A[m][n];
          for (var n = i + 1; n < N; n++) B[m][n - 1] = A[m][n];
        }
        for (var m = j + 1; m < N; m++) {
          B[m - 1] = [];
          for (var n = 0; n < i; n++) B[m - 1][n] = A[m][n];
          for (var n = i + 1; n < N; n++) B[m - 1][n - 1] = A[m][n];
        }
        adjA[i][j] = sign * this._Determinant(B); // Функцию Determinant см. выше
      }
    }
    return adjA;
  }

  // обратная матрица
  _InverseMatrix(
    A // A - двумерный квадратный массив
  ) {
    var det = this._Determinant(A);
    if (det == 0) return false;
    var N = A.length,
      A = this._AdjugateMatrix(A);
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        A[i][j] /= det;
      }
    }
    return A;
  }

  getX() {
    let res = [];
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      let row = [];
      sum = this._arraySum(this.matrix[i]) + this.Y[i][0];
      row.push(sum);
      res.push(row);
    }
    return res;
  }

  getA() {
    let res = [];
    let X = this.getX();

    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let k = 0; k < this.size; k++) {
        let x = this.matrix[i][k] / X[k];
        row.push(x);
      }
      res.push(row);
    }
    return res;
  }

  isProductive() {
    let res = false;
    let A = this.getA();
    let max = 0;

    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let k = 0; k < this.size; k++) {
        sum += Number(A[k][i]);
      }
      if (max < sum) {
        max = sum;
      }
    }
    if (max < 1) res = true;

    return res;
  }

  // (E-A)
  getEdiffA() {
    let res = [];
    let E = this._createE();
    let A = this.getA();
    res = this._diffMatrix(E, A);
    return res;
  }
  // (E-A)^-1
  getEdiffAInverse() {
    let EdiffA = this.getEdiffA();
    res = this._InverseMatrix(EdiffA);
    return res;
  }
}
let L = new Leontev();

// содержимое первого слайда
let screen1Html = () => {
  let size = L.size ? L.size : 2;
  let res = `<label for="size">
    <p>Введите размерность матрицы:</p>
    <input type="text" onchange="setSize()" class="styleInput" value = "${size}" />
    </label>`;
  L.size = size;
  createMatrix();
  return res;
};
let setSize = () => {
  L.size = Number(document.querySelector("input").value);
  createMatrix();
};
let createMatrix = () => {
  L.matrix = [];
  L.Y = [];

  for (let i = 0; i < L.size; i++) {
    let row = [];
    for (let k = 0; k < L.size; k++) {
      row.push(0);
    }
    L.matrix.push(row);
  }

  for (let i = 0; i < L.size; i++) {
    let row = [];
    row.push(0);
    L.Y.push(row);
  }
};

// содержимое второго слайда
let screen2Html = () => {
  let res =
    "<label > <p>заполните таблицу затрат:</p>" +
    drowInputMatrix(L.size, L.size) +
    "</label>";
  res +=
    "<label> <p>заполните конечный продукт (Y):</p>" +
    drowInputMatrix(L.size, 1, "Y") +
    "</label>";
  return res;
};
let setMatrix = (row, col, val, id = "") => {
  if (id != "") L.Y[row][col] = Number(val);
  else L.matrix[row][col] = Number(val);
};
let drowInputMatrix = (sizeY, sizeX, id = "") => {
  let res = "";
  let row = "";
  for (let i = 0; i < sizeY; i++) {
    for (let k = 0; k < sizeX; k++) {
      if (id != "")
        row += `<input type='text' id = ${id} onchange='setMatrix(${i},${k},this.value, this.id)' class='styleInput' />`;
      else
        row += `<input type='text' onchange='setMatrix(${i},${k},this.value)' class='styleInput' />`;
    }
    row = "<div class = 'row'>" + row + "</div>";
    res += row;
    row = "";
  }
  res = "<div class = 'matrix' >" + res + "</div>";

  return res;
};

// содержимое третьего слайда
let screen3Html = () => {
  let res = "";
  let matrix =
    "<label> <p>прямые затраты: </p>" + drowTableMatrix(L.matrix) + "</label>";
  let Y =
    "<label> <p>конечный продукт(Y): </p>" + drowTableMatrix(L.Y) + "</label>";
  let X =
    "<label> <p>Валовой выпуск(X): </p>" +
    drowTableMatrix(L.getX()) +
    "</label>";
  let A =
    "<label> <p>коофицент прямых затрат(А): </p>" +
    drowTableMatrix(L.getA()) +
    "</label>";

  let EdiffA = "";
  let EdiffAI = "";
  if (L.isProductive()) {
    EdiffA =
      "<label> <p>(E-A): </p>" + drowTableMatrix(L.getEdiffA()) + "</label>";
    EdiffAI =
      "<label> <p>(E-A)^-1 = (S): </p>" +
      drowTableMatrix(L.getEdiffAInverse()) +
      "</label>";
  }
  let productive = L.isProductive()
    ? "max < 1 модель продуктивна"
    : "max > 1 модель не продуктивна";

  res = matrix + Y + X + A + productive + EdiffA + EdiffAI;

  return res;
};

let drowTableMatrix = (arr) => {
  sizeY = arr.length;
  sizeX = arr[0].length;
  res = "";
  for (let i = 0; i < sizeY; i++) {
    let row = "";
    for (let k = 0; k < sizeX; k++) {
      let el = arr[i][k];
      if (String(el).length > 6) el = Number(el).toFixed(4);
      else el = Number(el);
      row += "<td>" + el + "</td>";
    }
    row = "<tr>" + row + "</tr>";
    res += row;
  }
  res = "<table>" + res + "</table>";
  return res;
};

let drowScreen = (screen) => {
  document.querySelector(".screen").innerHTML = screen;
};

let changeScreen = () => {
  switch (L.index) {
    case 0:
      drowScreen(screen1Html());
      break;
    case 1:
      drowScreen(screen2Html());
      break;
    case 2:
      drowScreen(screen3Html());
      break;
  }
};

let verification = () => {
  let res = true;
  let inputs = document.querySelectorAll("input");
  inputs.forEach((el) => {
    if (el.value == "") res = false;
  });
  return res;
};

let trackBtn = () => {
  let next = document.querySelector("#next");
  let prev = document.querySelector("#prev");

  next.onclick = () => {
    if (verification()) {
      L.index = L.index < 2 ? L.index + 1 : L.index;
      changeScreen();
    } else alert("заполните все поля");
  };

  prev.onclick = () => {
    L.index = L.index > 0 ? L.index - 1 : L.index;
    changeScreen();
  };
};

window.onload = () => {
  drowScreen(screen1Html());
  trackBtn();
};
