$(document).ready(() => {
  $(".result").html(getHtmlResult());
});

let getHtmlResult = () => {
  let res = "";
  let typeTest = localStorage.getItem("testType");
  let name = localStorage.getItem("name");
  let lastName = localStorage.getItem("lastName");
  let prefix = localStorage.getItem("prefix");

  if (typeTest == "trueFalse") {
    let more = localStorage.getItem("testResText");
    let testLength = localStorage.getItem("testLength");
    let resTest = localStorage.getItem("testRes");
    res = `<p><span class="nameUser">${name} ${lastName}</span>, результат проиденного теста: ${resTest} правильных из ${testLength}</p>
    <p>${more}</p>
    `;
  } else {
    let resTest = JSON.parse(localStorage.getItem("testRes"));
    res = `<p><span class="nameUser">${name} ${lastName}</span>, результат проиденного теста: ${resTest[prefix]} </p>
    <p>${resTest.moreInfo}</p>
    `;
  }

  return res;
};
