/* Const variables */

CONST_DELTA_MS = 100;
CONST_HOUR_MS = 1000 * 60 * 60;
CONST_MIN_MS = 1000 * 60;
CONST_SEC_MS = 1000;

CONST_PRESSED_MS = 1000;
CONST_PRESSING_CHECK_MS = 300;

CONST_KEY_SPACE = " ";
CONST_KEY_R_LOWER = "r";
CONST_KEY_R_UPPER = "R";


/* DOM */

const DOM = {
  body: document.body,
  button: document.getElementById("timerButton"),
  resetIndicator: document.getElementById("timerFillRed"),

  h: document.getElementById("timerTextHour"),
  m: document.getElementById("timerTextMinute"),
  s: document.getElementById("timerTextSecond"),

  darkModeButton: document.getElementById("darkModeButton")
};


/* Status */

const status = {
  isOn: true,
  isBeingPressed: false,
  isPressed: false
}

status.currentTheme = localStorage.getItem("theme");
status.preferDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (status.currentTheme == "dark")
  DOM.body.classList.toggle("dark-theme");
else if (status.currentTheme == "light")
  DOM.body.classList.toggle("light-theme");


/* Time */

const data = {
  ms: 0,
  msPressed: 0
};


/* Text */

const text = {
  h: "00",
  m: "00",
  s: "00"
};


/* Event Function */

let mouseDownInterval;

const eventFunc = {
  increase() {
    data.ms += CONST_DELTA_MS;
  },
  reset() {
    data.ms = 0;
  },
  getText() {
    const returnText = value => {
      if (value < 10)
        return "0" + value;
      else
        return String(value);
    }

    const h = parseInt(data.ms / CONST_HOUR_MS);
    text.h = returnText(h);
    
    const m = parseInt(data.ms % CONST_HOUR_MS / CONST_MIN_MS);
    text.m = returnText(m);
    
    const s = parseInt(data.ms % CONST_MIN_MS / CONST_SEC_MS);
    text.s = returnText(s);
  },
  showText() {
    DOM.h.innerText = text.h;
    DOM.m.innerText = text.m;
    DOM.s.innerText = text.s;

    document.title = `${text.h} : ${text.m} : ${text.s}`;
  },
  interval() {
    if (status.isOn)
    {
      eventFunc.increase();
      eventFunc.getText();
      eventFunc.showText();
    }
  },

  toggleStatus() {
    if (!status.isBeingPressed)
    {
      status.isOn = !status.isOn;
      DOM.body.classList.toggle("stop");
    }
    status.isBeingPressed = false;
  },

  toggleTheme() {
    let theme;
    if (status.preferDarkScheme.matches) {
      DOM.body.classList.toggle("light-theme");
      theme = DOM.body.classList.contains("light-theme") ? "light" : "dark";
    } else {
      DOM.body.classList.toggle("dark-theme");
      theme = DOM.body.classList.contains("dark-theme") ? "dark" : "light";
    }
    localStorage.setItem("theme", theme);
  },

  increasePress() {
    if (data.msPressed <= CONST_PRESSED_MS)
      data.msPressed += CONST_DELTA_MS;
    else
      data.msPressed = CONST_PRESSED_MS;
    DOM.resetIndicator.style.opacity = data.msPressed / CONST_PRESSED_MS;

    if (data.msPressed >= CONST_PRESSING_CHECK_MS)
      status.isBeingPressed = true;
    if (data.msPressed == CONST_PRESSED_MS)
      status.isPressed = true;
  },
  resetPress() {
    data.msPressed = 0;
    DOM.resetIndicator.style.opacity = 0;
  },
  mouseDown() {
    mouseDownInterval = setInterval(eventFunc.increasePress, CONST_DELTA_MS);
  },
  mouseUp() {
    clearInterval(mouseDownInterval);
    if (status.isPressed)
    {
      eventFunc.reset();
      eventFunc.getText();
      eventFunc.showText();
      status.isPressed = false;
    }
    eventFunc.resetPress();
  },
  keyDownR() {
    clearInterval(mouseDownInterval);

    eventFunc.reset();
    eventFunc.getText();
    eventFunc.showText();
    status.isPressed = false;

    eventFunc.resetPress();
  }
}


/* Initialize */

setInterval(eventFunc.interval, CONST_DELTA_MS);

DOM.button.addEventListener("click", eventFunc.toggleStatus);
DOM.darkModeButton.addEventListener("click", eventFunc.toggleTheme);

DOM.button.addEventListener("mousedown", eventFunc.mouseDown);
DOM.body.addEventListener("mouseup", eventFunc.mouseUp);
DOM.body.addEventListener("mouseleave", eventFunc.mouseUp);

DOM.button.addEventListener("touchstart", eventFunc.mouseDown);
DOM.button.addEventListener("pointerdown", eventFunc.mouseDown);
DOM.body.addEventListener("touchend", event => {
  event.preventDefault();
  eventFunc.mouseUp();
})
DOM.body.addEventListener("touchcancel", event => {
  event.preventDefault();
  eventFunc.mouseUp();
})
DOM.body.addEventListener("pointercancel", event => {
  event.preventDefault();
  eventFunc.mouseUp();
})

window.addEventListener("keydown", event => {
  if (event.key == CONST_KEY_SPACE)
    eventFunc.toggleStatus();
  if (event.key == CONST_KEY_R_UPPER || event.key == CONST_KEY_R_LOWER)
    eventFunc.keyDownR();
})