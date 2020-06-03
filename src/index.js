//classes declaration
const electron = require('electron');
const BreaksController = require('./lib/BreaksController');
const MenuTemplates = require('./lib/MenuTemplates');
const WindowController = require('./lib/WindowController');

//classes initialization
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const breaksController = new BreaksController();
const windowController = new WindowController(BrowserWindow, app);
const menuTemplate = new MenuTemplates();

//global variables declaration
let breakWindow, settingsWindow, tray, timer, trayMenu;


const isMac = process.platform === 'darwin';
const timerDuration = 40; //in minutes

// process.env.NODE_ENV = 'production';
if (process.env.NODE_ENV !== 'production') {
    app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

function createTray() {
    tray = new Tray('src/assets/img/icons/tray_icons/IconTemplate.png')
    trayMenu = Menu.buildFromTemplate(menuTemplate.getTrayMenuTemplate())
    module.exports.trayMenu = trayMenu;
    tray.setToolTip('Ergonomic breaks reminder')
    tray.setContextMenu(trayMenu)
}

async function processMainTimer(distance, label) {
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

function createTimer() {
    timer = breaksController.createTimer(timerDuration, processMainTimer);
    trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
}

app.whenReady().then(() => {
    createTray();
    createTimer();
});

module.exports.getTimerInstance = () => {
    return timer
}

module.exports.getAppInstance = () => {
    return app
}

module.exports.getTrayInstance = () => {
    return tray
}

module.exports.createTimer = createTimer;