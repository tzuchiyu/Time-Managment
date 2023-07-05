const yesButton = document.querySelector(".yesButton"),
  noButton = document.querySelector(".noButton"),
  warningBox = document.querySelector(".warningBox"),
  section = document.querySelector("section"),
  add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  e.preventDefault();

  // get input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  // 輸入限制
  if (todoText === "") {
    alert("Please enter your goals.");
    return;
  }
  if (todoDate === "" || todoMonth === "") {
    alert("Please enter the date.");
    return;
  }
  if (todoDate > 32 || todoMonth > 13) {
    alert("Invalid date.");
    return;
  }

  // create a todo
  let todo = document.createElement("div");
  todo.classList.add("todolist");
  let text = document.createElement("p");
  text.classList.add("todoText");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todoTime");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  // clear input
  form.children[0].value = "";

  // * create complete button and delete button
  // 1. if complete
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", (e) => {
    let completeTodo = e.target.parentElement;
    completeTodo.classList.toggle("done");
    if (completeTodo.classList == "todolist done") {
      completeButton.innerHTML =
        '<i class="fa-solid fa-arrow-rotate-left"></i>';
      completeButton.style.color = "black";
    } else {
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.style.color = "";
    }
  });
  // 2. if delete
  // warning box and yes/no Button
  // 如果按刪除
  let trashButton = document.createElement("button");
  trashButton.classList.add("delete");
  trashButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  trashButton.addEventListener("click", (e) => {
    // 找到要刪除的list
    let deleteTodo = e.target.parentElement;
    // 跳出提醒視窗
    warningBox.style = "visibility: visible";
    // 如果按yes或no後所發生的事
    yesButton.addEventListener("click", (e) => {
      warningBox.style = "visibility: hidden";
      deleteTodo.style.animation = "scaleDown 0.5s forwards";
      // remove要分開設定，否則同時進行將不會呈現animation
      deleteTodo.addEventListener("animationend", () => {
        // remove在local storage中的資料
        // 如果要移除的文字 = local storage中的文字，就移除該array
        let removeText = deleteTodo.children[0].innerText;
        let myListArray = JSON.parse(localStorage.getItem("list"));
        // 從第?個item開始的第
        myListArray.forEach((item, index) => {
          if (item.todoText == removeText) {
            myListArray.splice(index, 1);
          }
          // 更新local storage
          localStorage.setItem("list", JSON.stringify(myListArray));
        });
        deleteTodo.remove();
      });
    });
    noButton.addEventListener("click", (e) => {
      warningBox.style = "visibility: hidden";
    });
    todo.style.animation = "scaleUp 0.5s forwards";
  });
  // 放入todo
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  section.appendChild(todo);

  // * local storage setting
  // 1. 建立object，create an object for my local storage
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  // 2. 將data存在object的array中
  // 注意：local storage只能存放"string"
  let myList = localStorage.getItem("list");
  // 如果沒有資料就抓取頁面上的資料
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } // 如果有資料就新增在object中，再存回local storage
  // 也不必清除原先的value，因為如果發現key重複了，就會直接update新的value
  else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  console.log(JSON.parse(myList));
});

loadData();
///////////////////////////////////////////
function loadData() {
  // 顯示local storage的資料
  let myLocalStorage = localStorage.getItem("list");
  // 如果有資料，就依序放在建立的表格中
  if (myLocalStorage !== null) {
    let myListArray = JSON.parse(myLocalStorage);
    myListArray.forEach((item) => {
      // create a todo
      let todo = document.createElement("div");
      todo.classList.add("todolist");
      let text = document.createElement("p");
      text.classList.add("todoText");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todoTime");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      // * create complete button and delete button
      // 1. if complete
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let completeTodo = e.target.parentElement;
        completeTodo.classList.toggle("done");
        if (completeTodo.classList == "todolist done") {
          completeButton.innerHTML =
            '<i class="fa-solid fa-arrow-rotate-left"></i>';
          completeButton.style.color = "black";
        } else {
          completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
          completeButton.style.color = "";
        }
      });

      // 2. if delete
      // warning box and yes/no Button
      // 如果按刪除
      let trashButton = document.createElement("button");
      trashButton.classList.add("delete");
      trashButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
      trashButton.addEventListener("click", (e) => {
        // 找到要刪除的list
        const deleteTodo = e.target.parentElement;
        // 跳出提醒視窗
        // let warningBox =
        //   trashButton.parentElement.parentElement.previousElementSibling;
        warningBox.style = "visibility: visible";
        // 如果按yes或no後所發生的事
        yesButton.addEventListener("click", (e) => {
          console.log(deleteTodo);
          console.log(deleteTodo.children[0].innerText);
          warningBox.style = "visibility: hidden";
          deleteTodo.style.animation = "scaleDown 0.5s forwards";
          // remove要分開設定，否則同時進行將不會呈現animation
          deleteTodo.addEventListener("animationend", () => {
            // remove在local storage中的資料
            // 如果要移除的文字 = local storage中的文字，就移除該array
            let removeText = deleteTodo.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
              if (item.todoText == removeText) {
                myListArray.splice(index, 1);
              }
              // 更新local storage
              localStorage.setItem("list", JSON.stringify(myListArray));
            });
            deleteTodo.remove();
          });
        });
        noButton.addEventListener("click", (e) => {
          warningBox.style = "visibility: hidden";
        });
      });
      todo.style.animation = "scaleUp 0.5s forwards";

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

// string比大小只會比較第一個字，所以要將string都轉為Number()
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  // 放入沒有被比較到的值
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}

// 遞迴
function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));
  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }
  // load data (已經包成function)
  loadData();
});

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
