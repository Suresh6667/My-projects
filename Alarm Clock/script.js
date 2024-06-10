let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./mixkit-alert-alarm-1005.wav");

let initialHour = 0, 
  initialMinute = 0, 
  alarmIndex = 0;

//append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//search for value in object
const searchObject = (parameter, value) => {
    let alarmObject, objIndex, exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists =true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObject, objIndex];
};

//display time
function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
        appendZero(date.getHours()), 
        appendZero(date.getMinutes()), 
        appendZero(date.getSeconds()),
    ];

    //display time
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    //alarm
    alarmsArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMnute}` === `${hours}:${minutes}`) {
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });   
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10){
        inputValue = appendZero(inputValue);
    }
    return inputValue;
};

hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});


//create alarm div
const createAlarm = (alarmObj) => {
    const {id, alarmHour, alarmMinute} = alarmObj;
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

    //checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked){
            startAlarm(e);
        }else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);
    //delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);

};


//set alarm
setAlarm.addEventListener("click", () => {
    alarmIndex += 1;

    // alarmObject
    let alarmObj ={};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.isActive = false;
    console.log(alarmObj);
    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
});

//start alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index]= searchObject("id", searchId);
    if(exists){
        alarmsArray[index].isActive = true;

    }
};

//stop alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists){
        alarmsArray[index].isActive = false;
        alarmSound.pause();
    }
};


//delete alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists){
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
};

window.onload = () => {
    setInterval(displayTimer);
    initialHour = 0;
    initialMinute = 0;
    alarmIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);

};