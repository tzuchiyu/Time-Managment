// 天氣API
//指定DOM
var xhr = new XMLHttpRequest();
var area = document.querySelector(".area");
var tem = document.querySelector(".tem");
// var fellLike = document.querySelector(".feel-like");
// var humidity = document.querySelector(".humidity");

//綁定監聽事件
area.addEventListener("change", showWeather, false);

//串接台灣天氣api，將城市名稱代入html的選單中
function getWeather() {
  xhr.open(
    "get",
    "https://api.openweathermap.org/data/2.5/box/city?bbox=120,19,122,30,10&appid=cb9de36bbd3a6969b700004716fd3036",
    true
  );
  xhr.send(null);
  xhr.onload = function () {
    var dataObject = JSON.parse(xhr.responseText);
    var len = dataObject.list.length;
    for (var i = 0; i < len; i++) {
      var city = dataObject.list[i].name;
      var option = document.createElement("option");
      option.textContent = city;
      area.appendChild(option);
    }
    showWeather();
  };
}
getWeather();

//選擇城市後，顯示相對應天氣狀況
function showWeather(e) {
  /*顯示預設值可以在 xhr.onload() 裡面執行 showWeather()，然後在 showWeather()，裡面增加判斷式若沒有 e 則設定 select 的預設值，反之則是設定 e.target.value*/
  var select = "";
  if (!e) {
    select = "Taipei";
  } else {
    select = e.target.value;
  }
  var dataObject = JSON.parse(xhr.responseText);
  var len = dataObject.list.length;
  for (var i = 0; i < len; i++) {
    var temList = dataObject.list[i].main.temp;
    var fellLikeList = dataObject.list[i].main.feels_like;
    var humidityList = dataObject.list[i].main.humidity;
    if (select == dataObject.list[i].name) {
      // console.log(typeof temList); //number
      tem.textContent = `${temList.toString().slice(0, 4)} °C`;
      // fellLike.textContent = fellLikeList + "度";
      //   humidity.textContent = humidityList;
    }
  }
}

// 時鐘
function startTime() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  var ss = today.getSeconds();
  h = checkTime(hh);
  m = checkTime(mm);
  s = checkTime(ss);
  document.querySelector("#clock").innerHTML = `${h}:${m}:${s}`;
  setTimeout(startTime, 500);
}

function checkTime(i) {
  return i < 10 ? "0" + i : i;
}

//------------------------------
// Log in
function logIn() {
  let signInForm = document.querySelector(".signInForm");
  signInForm.style.display =
    signInForm.style.display === "flex" ? "none" : "flex";
}

// //------------------------------
// // 文字動化
let paraList = document.querySelectorAll(".paraContents li");
document.addEventListener("scroll", () => {
  let scrollHeight = window.pageYOffset;
  if (scrollHeight >= 1000 && scrollHeight < 1500) {
    paraList.forEach((li, index) => {
      if (index % 2 === 0) {
        li.classList.add(
          "animate__animated",
          "animate__bounceInRight",
          "animate__slow",
          "1s"
        );
      } else {
        li.classList.add(
          "animate__animated",
          "animate__fadeInRight",
          "animate__slow",
          "1s"
        );
      }
    });
  } else {
    paraList.forEach((li) => {
      li.classList.remove(
        "animate__animated",
        "animate__bounceInRight",
        "animate__fadeInRight",
        "animate__slow",
        "1s"
      );
    });
  }
});

// // 標題動畫
let title = document.querySelector(".title");
let title1 = document.querySelector(".title1");
let title2 = document.querySelector(".title2");
let image = document.querySelector(".image");
document.addEventListener("scroll", () => {
  let scrollHeight = window.pageYOffset;
  if (scrollHeight >= 300 && scrollHeight < 1500) {
    title.style = "animation: outer-left 1s 1s ease both;";
    title1.style =
      "animation: text-clip 1s 0s cubic-bezier(0.5, 0, 0.1, 1) both";
    title2.style =
      "animation: text-clip 1s 0s cubic-bezier(0.5, 0, 0.1, 1) both;";
    image.style =
      "animation: image-in 1s cubic-bezier(0.5, 0, 0.1, 1) 2s backwards;";
  } else {
    title.style.animation = "";
    title1.style.animation = "";
    title2.style.animation = "";
    image.style.animation = "";
  }
});
