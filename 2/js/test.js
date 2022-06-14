import testData from "./moduls/testData.js";

$(document).ready(() => {
  drowQuestion();

  let res = {};
  // для автоматического перехода к след вопросу
  $("input").click((e) => {
    res = addRes(e, res);
    nextStep(e);
  });
  // кнопка результата
  $(".btn-res").click(() => {
    checkAnswers(res);
  });
});

// рисует вопросы
let drowQuestion = () => {
  let testName = localStorage.getItem("testName");
  let testQuest = getQuest(testName);

  if (testQuest.type == "trueFalse") {
    localStorage.setItem("testType", "trueFalse");
  } else {
    localStorage.setItem("testType", "increment");
  }

  let questHtml = createHtml(testQuest.questions);
  $(".qustion").html(questHtml);
};

// получить данные теста из общего массива
let getQuest = (testName) => {
  let res = {};

  let arrTests = Object.keys(testData);
  arrTests.forEach((test) => {
    if (testName == test) {
      res = testData[test];
      localStorage.setItem("testLength", testData[test].questions.length);
    }
  });

  return res;
};

// формирует html разметку вопросов
let createHtml = (arr) => {
  let res = "";

  arr.forEach((quest, index) => {
    drowNav(index);

    let optionHtmlArr = quest.option.map((option) => {
      return `<label><input type="radio" name="q${index}" value="${option}"  />${sliceOption(
        option
      )}</label>`;
    });
    let optionHtmlStr = optionHtmlArr.join(" ");

    res += `
    <div class="qustion__item" id="${index}">
          <p>
            <span>вопрос${index + 1}</span> : ${quest.quest}
          </p>
            ${optionHtmlStr}
        </div>
    `;
  });

  return res;
};
// обрезает префикс
let sliceOption = (option) => {
  let res = option;

  if (option.includes("<-") && option.includes("->")) {
    res = option.replace(getPrefix(option), "");
  }

  return res;
};
// получить префикс
let getPrefix = (option) => {
  let startPrefix = option.indexOf("<-");
  let endPrefix = option.lastIndexOf("->") + 2;
  let prefix = "";
  for (let i = startPrefix; i < endPrefix; i++) {
    prefix += option[i];
  }
  return prefix;
};

// рисует элементы навигации
let drowNav = (quantity) => {
  let navHtml = "";
  for (let i = 0; i < quantity + 1; i++) {
    navHtml += `<a href="#${i}" class="nav__item" id = "nav${i}" content="вопрос${
      i + 1
    }"></a>`;
  }
  $(".nav").html(navHtml);
};

// проверка результата
let checkAnswers = (res) => {
  let resume = true;
  if (!isFullFill()) {
    resume = confirm(
      "Вы ответили не на все вопросы. Вы точно хотите подвести результаты ?"
    );
  }
  if (resume) {
    if (localStorage.getItem("testType") == "trueFalse") {
      let arrRes = Object.values(res);
      let trueAns = 0;
      arrRes.forEach((el) => {
        if (el == "true") trueAns++;
      });
      localStorage.setItem("testRes", trueAns);
      localStorage.setItem("testResText", testAnswerTF(trueAns));
      document.location.href = "result.html";
    } else {
      let arrRes = Object.values(res);
      let arrResPrefix = Object.keys(res);
      let maxElIndex = getIndex(arrRes);
      let prefix = arrResPrefix[maxElIndex].replace("<-", "").replace("->", "");
      localStorage.setItem("prefix", prefix);
      localStorage.setItem("testRes", getFinalAnswer(prefix));
      document.location.href = "result.html";
    }
  }
};
// получить полный ответ trueFalse

let testAnswerTF = (colTrueA) => {
  let res = "";

  let questData = getQuest(localStorage.getItem("testName"));
  let answers = questData.answer[0];
  let index = Object.keys(questData.answer[0]);
  index.forEach((el) => {
    if (colTrueA >= el) res = answers[el];
  });

  return res;
};

// получить полный ответ increment
let getFinalAnswer = (prefix) => {
  let resF;

  let questData = getQuest(localStorage.getItem("testName"));
  questData.answer.forEach((el) => {
    let elArr = Object.keys(el);
    elArr.forEach((item) => {
      if (prefix == item) {
        resF = JSON.stringify(el);
      }
    });
  });

  return resF;
};

// определяет на все ли вопросы ответили
let isFullFill = () => {
  let res = true;

  let arrNav = document.querySelectorAll(".nav__item");
  arrNav.forEach((item) => {
    if ($(item).css("background").includes("rgb(128, 128, 128)")) {
      res = false;
    }
  });

  return res;
};

// ищет индекс наибольшего элемента массива
let getIndex = (arr) => {
  let greatest = arr[0];
  let index = 0;
  arr.forEach(function (item, i) {
    if (item > greatest) (greatest = item), (index = i);
  });
  return index;
};

// заполнения массива с ответами на тест
let addRes = (e, res) => {
  let resF = res;
  if (localStorage.getItem("testType") == "trueFalse") {
    if (e.target.value.includes("<t>")) resF[e.target.name] = "true";
    else resF[e.target.name] = "false";
  } else {
    let option = e.target.value;
    let prefix = getPrefix(option);
    resF[prefix] = resF[prefix] >= 0 ? resF[prefix] + 1 : 1;
  }
  return resF;
};

// функция для перехода на след вопрос
let nextStep = (e) => {
  let name = e.target.name;
  let nextId = parseInt(name.replace("q", ""));
  document.location = `#${nextId + 1}`;
  $(`#nav${nextId}`).css("background", "orange");
};
