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

const data = {
  ms: 0
};


/* Text */

const text = {
  h: "00",
  m: "00",
  s: "00"
};


/* Event Function */

const eventFunc = {
  increase() {
    data.ms += CONST_DELTA_MS;
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