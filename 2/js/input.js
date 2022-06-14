$(document).ready(function () {
  $("input").on("input", () => {
    if (
      document.getElementById("name").value != "" &&
      document.getElementById("last-name").value != ""
    ) {
      $("button").removeAttr("disabled");
    } else {
      $("button").attr("disabled", true);
    }
  });

  $(".input__btn").click(() => {
    let name = document.getElementById("name").value;
    let lastName = document.getElementById("last-name").value;
    localStorage.setItem("name", name);
    localStorage.setItem("lastName", lastName);
    document.location.href = "pickTest.html";
  });
});
