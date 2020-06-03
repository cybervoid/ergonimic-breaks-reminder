const electron = require('electron');
const BreaksController = require('./lib/BreaksController');

const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const WindowController = require('./lib/WindowController');
const breaksController = new BreaksController();


const windowController = new WindowController(BrowserWindow, app);

let breakWindow, settingsWindow, tray, timer;
const isMac = process.platform === 'darwin';
const timerDuration = 40; //in minutes

// process.env.NODE_ENV = 'production';
if (process.env.NODE_ENV !== 'production') {
    app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

function createTray() {
    tray = new Tray('src/assets/img/icons/tray_icons/IconTemplate.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', click: async () => {
                windowController.createSettingsWindow()
            }
        },
        {type: 'separator'},
        {
            label: "Start break",
            click: async () => {
                windowController.createBreakWindow();
            }
        },
        {type: 'separator'},
        {
            label: 'Quit',
            click() {
                app.quit();
            }
        }
    ])
    tray.setToolTip('Ergonomic breaks reminder')
    tray.setContextMenu(contextMenu)
}

// function startTimer() {
//
//     let duration = timerDuration * 60 * 1000;
//     let countDownDate = new Date(Date.now() + (duration)).getTime();
//     let i = 0;
//
//     timer = setInterval(() => {
//         // Get today's date and time
//         let now = new Date().getTime();
//
//         // Find the distance between now and the count down date
//         let distance = countDownDate - now;
//         i++;
//
//         // Time calculations for days, hours, minutes and seconds
//         // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//         // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         let seconds = Math.floor((distance % (1000 * 60)) / 1000);
//
//         minutes = ('0' + minutes).slice(-2)
//         seconds = ('0' + seconds).slice(-2);
//
//         if (distance <= 1) {
//             clearInterval(timer);
//             breakWindow = windowController.createBreakWindow();
//         } else {
//             tray.setTitle(`${minutes}:${seconds}`);
//         }
//     }, 1000)
// }

function processMainTimer(label) {
    tray.setTitle(label);
}

app.whenReady().then(() => {
    createTray();
    breaksController.createTimer(timerDuration, processMainTimer);
});