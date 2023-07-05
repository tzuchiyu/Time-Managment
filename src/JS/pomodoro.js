const pomodoro = {
  started: false,
  minutes: 0,
  seconds: 0,
  fillerHeight: 0,
  fillerIncrement: 0,
  interval: null,
  minutesDom: null,
  secondsDom: null,
  fillerDom: null,
  init: function () {
    var self = this;
    this.minutesDom = document.querySelector(".minutes");
    this.secondsDom = document.querySelector(".seconds");
    this.fillerDom = document.querySelector(".filler");
    this.interval = setInterval(function () {
      self.intervalCallback.apply(self);
    }, 1000);
    document.querySelector(".work").onclick = function () {
      self.startWork.apply(self);
    };
    document.querySelector(".shortBreak").onclick = function () {
      self.startShortBreak.apply(self);
    };
    document.querySelector(".longBreak").onclick = function () {
      self.startLongBreak.apply(self);
    };
    document.querySelector(".stop").onclick = function () {
      self.stopTimer.apply(self);
    };
  },
  resetVariables: function (mins, secs, started) {
    this.minutes = mins;
    this.seconds = secs;
    this.started = started;
    this.fillerIncrement = 200 / (this.minutes * 60);
    this.fillerHeight = 0;
  },
  startWork: function () {
    this.resetVariables(25, 0, true);
    document.querySelector(".work").classList.add("active");
    document.querySelector(".shortBreak").classList.remove("active");
    document.querySelector(".longBreak").classList.remove("active");
  },
  startShortBreak: function () {
    this.resetVariables(5, 0, true);
    document.querySelector(".work").classList.remove("active");
    document.querySelector(".shortBreak").classList.add("active");
    document.querySelector(".longBreak").classList.remove("active");
  },
  startLongBreak: function () {
    this.resetVariables(15, 0, true);
    document.querySelector(".work").classList.remove("active");
    document.querySelector(".shortBreak").classList.remove("active");
    document.querySelector(".longBreak").classList.add("active");
  },
  stopTimer: function () {
    this.resetVariables(25, 0, false);
    this.updateDom();
  },
  toDoubleDigit: function (num) {
    if (num < 10) {
      return "0" + parseInt(num, 10);
    }
    return num;
  },
  updateDom: function () {
    this.minutesDom.innerHTML = this.toDoubleDigit(this.minutes);
    this.secondsDom.innerHTML = this.toDoubleDigit(this.seconds);
    this.fillerHeight = this.fillerHeight + this.fillerIncrement;
    this.fillerDom.style.height = this.fillerHeight + "px";
  },
  intervalCallback: function () {
    if (!this.started) return false;
    if (this.seconds == 0) {
      if (this.minutes == 0) {
        this.timerComplete();
        return;
      }
      this.seconds = 59;
      this.minutes--;
    } else {
      this.seconds--;
    }
    this.updateDom();
  },
  timerComplete: function () {
    this.started = false;
    this.fillerHeight = 0;
  },
};
window.onload = function () {
  pomodoro.init();
};

// const workBtn = document.querySelector(".work"),
//   stopBtn = document.querySelector(".stop"),
//   shortBreak = document.querySelector(".shortBreak"),
//   longBreak = document.querySelector(".longBreak");
// let workTime = 25,
//   shortBreakTime = 5,
//   longBreakTime = 15,
//   seconds = "00";
// // window.onload 是 JavaScript 中的一個事件，在網頁加載完畢後觸發
// // window.onload = () => {
// document.querySelector(".minutes").innerHTML = workTime;
// document.querySelector(".seconds").innerHTML = seconds;
// // 加入改變樣式的active
// workBtn.classList.add("active");
// // };

// //開始倒數
// function start() {
//   //改變開始時間
//   seconds = 59;
//   let workMinutes = workTime - 1;
//   let breakMinutes = shortBreakTime - 1;
//   // 倒數
//   breakCount = 0;
//   // 每秒執行一次timer
//   function timer() {
//     document.querySelector(".minutes").innerHTML = workMinutes;
//     document.querySelector(".seconds").innerHTML = seconds;
//     // 每秒減一次
//     seconds = seconds - 1;
//     // 如果秒數為0
//     if (seconds === 0) {
//       // 分鐘就-1
//       workMinutes = workMinutes - 1;
//       // 如果分鐘減到變-1了
//       if (workMinutes === -1) {
//         //  0 除以任何非零整數都會得到餘數 0
//         if (breakCount % 2 === 0) {
//           // 開始休息
//           workMinutes = breakMinutes;
//           breakCount++;

//           workBtn.classList.remove("active");
//           shortBreak.classList.add("active");
//         } else {
//           // 繼續work
//           workMinutes = workTime;
//           breakCount++;

//           workBtn.classList.add("active");
//           shortBreak.classList.remove("active");
//         }
//       }
//       seconds = 59;
//     }
//   }
//   setInterval(timer, 1000);
// }
