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

function processMainTimer(distance, label) {

    if (distance <= 1) {
        clearInterval(timer);
        breakWindow = windowController.createBreakWindow();
    } else {
        tray.setTitle(label);
        if (breakWindow) {
            console.log(breakWindow)
        }
    }
}

app.whenReady().then(() => {
    createTray();
    timer = breaksController.createTimer(timerDuration, processMainTimer);
});