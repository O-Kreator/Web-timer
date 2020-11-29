/* Const variables */

CONST_DELTA_MS = 100;
CONST_HOUR_MS = 1000 * 60 * 60;
CONST_MIN_MS = 1000 * 60;
CONST_SEC_MS = 1000;


/* DOM */

const DOM = {
  body: document.body,
  button: document.getElementById("timerButton"),
  h: document.getElementById("timerTextHour"),
  m: document.getElementById("timerTextMinute"),
  s: document.getElementById("timerTextSecond"),

  darkModeButton: document.getElementById("darkModeButton")
};


/* Status */

const status = {
  isOn: true
}

status.currentTheme = localStorage.getItem("theme");
status.preferDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (status.currentTheme == "dark")
  DOM.body.classList.toggle("dark-theme");
else if (status.currentTheme == "light")
  DOM.body.classList.toggle("light-theme");


/* Time */

const data = {};

data.ms = 0;


/* Text */

const text = {};

text.h = "00";
text.m = "00";
text.s = "00";


/* Event Function */

const eventFunc = {
  increase() {
    data.ms += CONST_DELTA_MS;
  },
  getText() {
    const h = parseInt(data.ms / CONST_HOUR_MS);
    text.h = h;
    if (h < 10)
      text.h = "0" + text.h;
    
    const m = parseInt(data.ms % CONST_HOUR_MS / CONST_MIN_MS);
    text.m = m;
    if (m < 10)
      text.m = "0" + text.m;
    
    const s = parseInt(data.ms % CONST_MIN_MS / CONST_SEC_MS);
    text.s = s;
    if (s < 10)
      text.s = "0" + text.s;
  },
  showText() {
    DOM.h.innerText = text.h;
    DOM.m.innerText = text.m;
    DOM.s.innerText = text.s;
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
    status.isOn = !status.isOn;
    DOM.body.classList.toggle("stop");
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
  }
}


/* Initialize */

setInterval(eventFunc.interval, CONST_DELTA_MS);

DOM.button.addEventListener("click", eventFunc.toggleStatus);
DOM.darkModeButton.addEventListener("click", eventFunc.toggleTheme);