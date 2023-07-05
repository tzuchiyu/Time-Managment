const calendar = document.querySelector(".calendar"),
  monthYear = document.querySelector(".monthYear"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prevButton"),
  next = document.querySelector(".nextButton"),
  todayButton = document.querySelector(".todayButton"),
  gotoButton = document.querySelector(".gotoButton"),
  dateInput = document.querySelector(".dateInput"),
  eventDay = document.querySelector(".eventDay"),
  eventDate = document.querySelector(".eventDate"),
  eventsContainer = document.querySelector(".eventsContainer");

let today = new Date();
let activeDay;
let month = today.getMonth();
// console.log(month); // 真正月份-1
let year = today.getFullYear();
let date = today.getDate();
// console.log(date);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// (預設的事件名稱、時間)
// const eventCheckArr = [
//   // 第一個obj
//   {
//     day: 29,
//     month: 4,
//     year: 2023,
//     event: [
//       { title: "4月Event 1", time: "10:00 AM - 11:00 AM" },
//       { title: "4月Event 2", time: "11:00 AM - 12:00 PM" },
//     ],
//   },
//   // 第二個obj
//   {
//     day: 5,
//     month: 4,
//     year: 2023,
//     event: [
//       { title: "4月Event 33", time: "8:00 PM - 10:00 PM" },
//       { title: "4月Event 55", time: "11:00 AM - 13:00 PM" },
//     ],
//   },
// ];

// 可放入行程的array
let eventCheckArr = [];
getEvents();

// left part
// 放入月曆
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  //   console.log(firstDay); // 當月第一天日期
  const lastDay = new Date(year, month + 1, 0);
  //   console.log(lastDay); // 當月最後一天日期
  const prevLastDay = new Date(year, month, 0);
  //   console.log(prevLastDay); // 前月最後一天日期
  const prevDate = prevLastDay.getDate();
  //   console.log(prevDate); // 前月最後一天的日
  const lastDate = lastDay.getDate();
  // 當月最後一天的日
  const day = firstDay.getDay();
  //   console.log(day); // 當月第一天的禮拜幾
  const nextDays = 7 - lastDay.getDay() - 1;
  //   console.log(nextDays); // 7 - 當月最後一天的禮拜幾 -1 => 下個月第一星期到禮拜幾

  // month會回傳數字(0-11)，將數字做為index放入months
  monthYear.innerHTML = months[month] + " " + year;

  // - 放入月曆：前月的日
  // day = 當月第一天的禮拜；prevDate = 前月最後一日
  // 往前推算前月要放到幾日 => 前月最後一日-當月的禮拜(i+1)
  /** ex. 如果當月第一天是禮拜二，代表還缺禮拜日和一(需要放前月的)
  假設前月最後一天是31號，就代表要放30、31*/
  let days = "";
  for (let i = day; i > 0; i--) {
    // day=2,1
    let previousDates = prevDate - i + 1; // 30.31
    let eventCheck = false;
    eventCheckArr.forEach((obj) => {
      if (
        obj.day === previousDates &&
        obj.month === month &&
        obj.year === year
      ) {
        eventCheck = true;
      }
    });
    if (eventCheck == true) {
      days += `<div class="day prev appointment">${previousDates}</div>`;
    } else {
      days += `<div class="day prev">${previousDates}</div>`;
    }
  }

  // - 放入月曆：當月的日
  for (let i = 1; i <= lastDate; i++) {
    // * 確認輸入的事件日期是不是當年當月的日期
    let eventCheck = false;
    eventCheckArr.forEach((obj) => {
      if (obj.day === i && obj.month === month + 1 && obj.year === year) {
        eventCheck = true;
      }
    });
    // -- 如果是今天，要加上day和today
    if (
      i == new Date().getDate() &&
      year == new Date().getFullYear() &&
      month == new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      // * 如果事件日期也是今天，就加上day,today,appointment
      if (eventCheck == true) {
        days += `<div class="day today appointment">${i}</div>`;
        showEvents(i);
      } else {
        days += `<div class="day today">${i}</div>`;
      }
    } // -- 如果不是今天，就只需加上day，不需加today
    else {
      // * 如果事件日期不是今天，就找到正確日期加上appointment
      if (eventCheck == true) {
        days += `<div class="day appointment">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  // - 放入月曆：下月的日
  // nextDays = 下個月第一星期到禮拜幾
  for (let i = 1; i <= nextDays; i++) {
    let eventCheck = false;
    eventCheckArr.forEach((obj) => {
      if (obj.day === i && obj.month === month + 2 && obj.year === year) {
        eventCheck = true;
      }
    });
    if (eventCheck == true) {
      days += `<div class="day next appointment">${i}</div>`;
    } else {
      days += `<div class="day next">${i}</div>`;
    }
  }

  daysContainer.innerHTML = days;

  active();
}
initCalendar();

// 前月function
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

// 下月funtion
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// todayButton
todayButton.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
  document.querySelector(".today").classList.add("active");
});

// 查詢指定年月份前要先過濾輸入內容
// keyup放開鍵盤的瞬間觸發事件，相似的還有keydown和keypress
dateInput.addEventListener("keyup", () => {
  // 只能輸入數字
  // 正規表達式 /[^0-9]/ = /\D/ 挑出非數字或斜線的字，用空字串代替
  // g修飾符：比較對象爲字串全部時
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2 && dateInput.value.indexOf("/") <= -1) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 6) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  // backspace鍵; ???
  // if (e.inputType === "deleteContentBackward") {
  //   if (dateInput.value.length === 3) {
  //     dateInput.value = dateInput.value.slice(0, 2);
  //   }
  // }
});
// 查詢指定年月份
gotoButton.addEventListener("click", () => {
  const dateArr = dateInput.value.split("/");
  // console.log(dateArr);
  // 驗證年月輸入是否正確
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      // console.log(dateArr);
    } // 如果日期無效
    else {
      alert(
        `Couldn't find " ${dateInput.value} ", please enter a valid date. \n( form: mm / yyyy )`
      );
    }
  }
});
// right part
const addEventContainer = document.querySelector(".addEventContainer"),
  addEventBtn = document.querySelector(".addEventBtn"),
  addOnBtn = document.querySelector(".addOnBtn"),
  closeBtn = document.querySelector(".close"),
  eventName = document.querySelector(".eventName"),
  eventTimeFrom = document.querySelector(".eventTimeFrom"),
  eventTimeTo = document.querySelector(".eventTimeTo");
// 點擊按鈕
addOnBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});
closeBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});
// 輸入行程，最多50字
eventName.addEventListener("input", () => {
  eventName.value = eventName.value.slice(0, 50);
});
eventTimeFrom.addEventListener("input", () => {
  eventTimeFrom.value = eventTimeFrom.value.replace(/[^0-9:]/g, "");
  if (eventTimeFrom.value.length == 2) {
    eventTimeFrom.value += ":";
  }
  if (eventTimeFrom.value.length > 5) {
    eventTimeFrom.value = eventTimeFrom.value.slice(0, 5);
  }
});
eventTimeTo.addEventListener("input", () => {
  eventTimeTo.value = eventTimeTo.value.replace(/[^0-9:]/g, "");
  if (eventTimeTo.value.length == 2) {
    eventTimeTo.value += ":";
  }
  if (eventTimeTo.value.length > 5) {
    eventTimeTo.value = eventTimeTo.value.slice(0, 5);
  }
});

// 設定游標所選取的日期
function active() {
  // 如果有任何一天被點擊
  let days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // Number(true) => 1；Number(flase) => 0；回傳數字
      /** 呼叫選取的日期，但放在這邊會導致顯示錯誤，
       因為如果跳到上或下個月，抓到的禮拜就不正確 */
      // getActiveDay(i);
      // console.log(e.target.innerHTML); // typeof是string
      activeDay = Number(e.target.innerHTML);
      // 移除之前選取日期;
      days.forEach((day) => {
        day.classList.remove("active");
      });
      // - 如果選到上個月的日期
      if (e.target.classList.contains("prev")) {
        // 跳到上個月
        prevMonth();
        // 再更新顯示的日期和禮拜
        getActiveDay(e.target.innerHTML);
        showEvents(Number(e.target.innerHTML));
        // 找到這個月的日期後加入active
        let days = document.querySelectorAll(".day");
        days.forEach((day) => {
          if (
            // 確認是這個月(否則可能會選到兩個月份的)
            !day.classList.contains("prev") &&
            day.innerHTML === e.target.innerHTML
          ) {
            // 確認後加active
            day.classList.add("active");
          }
        });
      } // - 如果選到下個月的日期
      else if (e.target.classList.contains("next")) {
        nextMonth();
        getActiveDay(e.target.innerHTML);
        showEvents(Number(e.target.innerHTML));
        let days = document.querySelectorAll(".day");
        days.forEach((day) => {
          if (
            !day.classList.contains("next") &&
            day.innerHTML === e.target.innerHTML
          ) {
            day.classList.add("active");
          }
        });
      } // - 如果選到這個月的日期
      else {
        day.classList.add("active");
        getActiveDay(e.target.innerHTML);
        showEvents(Number(e.target.innerHTML));
      }
    });
  });
}

// (active)點選的日期 要顯示時間
function getActiveDay(date) {
  let day = new Date(year, month, date);
  let dayName = day.toString().slice(0, 4);
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${date} ${months[month]} ${year}`;
}

// 顯示active所選取日期的事件
function showEvents(date) {
  let findEvent = "";
  // 如果事件日期和所選日期資料符合
  eventCheckArr.forEach((obj) => {
    if (date === obj.day && month + 1 === obj.month && year === obj.year) {
      obj.event.forEach((o) => {
        findEvent += `
        <div class="event">
        <div class="title">
          <img
            src="https://img.icons8.com/ios-glyphs/10/eb6c4c/filled-circle.png"
          />
          <h3 class="eventTitle">${o.title}</h3>
        </div>
        <div class="eventTime">${o.time}</div>
      </div>
      <div class="delete"></div>`;
      });
    }
  });
  // 如果事件日期和所選日期資料不符合或查無資料
  if (findEvent === "") {
    findEvent = `
    <div class="event">
      <div class="noEvent">
        <h3>No Event</h3>
      </div>
    </div>`;
  }
  eventsContainer.innerHTML = findEvent;
  // 新增事件到local storage
  saveEvents();
}

// 新增event
addEventBtn.addEventListener("click", () => {
  const addEventName = eventName.value;
  const addEventTimeFrom = eventTimeFrom.value;
  const addEventTimeTo = eventTimeTo.value;
  // console.log(addEventName);
  // console.log(convertTime(addEventTimeFrom));
  // console.log(convertTime(addEventTimeTo));
  if (addEventName === "" || addEventTimeFrom === "" || addEventTimeTo === "") {
    alert("Please fill all the fields.");
    return;
  }
  let timeFromArr = addEventTimeFrom.split(":");
  let timeToArr = addEventTimeTo.split(":");
  // console.log(timeFromArr);
  // console.log(timeToArr);
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format.");
    return;
  }

  const timeFrom = convertTime(addEventTimeFrom);
  const timeTo = convertTime(addEventTimeTo);
  const newEvent = {
    title: `${addEventName}`,
    time: `${timeFrom} - ${timeTo}`,
  };

  // 確認是否有輸入事件值
  let eventAdded = false;
  // 如果當天已經有事件存在了，那只需新增event的地方
  if (eventCheckArr.length > 0) {
    eventCheckArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.event.push(newEvent);
        eventAdded = true;
      }
    });
  }
  // 如果事件值原本沒有事件值，那就新增完整的obj
  if (eventAdded == false) {
    eventCheckArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      event: [newEvent],
    });
  }

  addEventContainer.classList.remove("active");
  eventName.value = "";
  eventTimeFrom.value = "";
  eventTimeTo.value = "";
  showEvents(activeDay);

  // 新增appointment
  const activeDayElem = document.querySelector(".day.active");
  if (!activeDayElem.classList.contains("appointment")) {
    activeDayElem.classList.add("appointment");
  }
});

// 移除event
eventsContainer.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventCheckArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.event.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.event.splice(index, 1);
            }
          });
          // 如果沒有事件值在eventsArr中，就移除整個obj
          if (event.event.length === 0) {
            eventCheckArr.splice(eventCheckArr.indexOf(event), 1);
            // 移除appointment
            let activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("appointment")) {
              activeDayEl.classList.remove("appointment");
            }
          }
        }
      });
      showEvents(activeDay);
    }
  }
});

// 將時間分成上午或下午
function convertTime(time) {
  // console.log(time);
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = `${timeHour}:${timeMin} ${timeFormat}`;
  return time;
}

function saveEvents() {
  console.log(localStorage);
  localStorage.setItem("events", JSON.stringify(eventCheckArr));
}
function getEvents() {
  if (localStorage.getItem("events") !== null) {
    eventCheckArr.push(...JSON.parse(localStorage.getItem("events")));
  }
}

//----------------------------------------
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
      //   fellLike.textContent = fellLikeList + "度";
      //   humidity.textContent = humidityList;
    }
  }
}

//------------------------------
// Log in
function logIn() {
  let signInForm = document.querySelector(".signInForm");
  signInForm.style.display =
    signInForm.style.display === "flex" ? "none" : "flex";
}
