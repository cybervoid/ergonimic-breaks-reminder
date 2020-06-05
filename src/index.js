//classes declaration
const electron = require('electron');
const BreaksController = require('./lib/BreaksController');
const MenuTemplates = require('./lib/MenuTemplates');
const windowController = require('./lib/WindowController');

//classes initialization
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const breaksController = new BreaksController();
const menuTemplate = new MenuTemplates();

//global variables declaration
let breakWindow, settingsWindow, tray, timer, trayMenu, timerProgress;


const isMac = process.platform === 'darwin';
const timerDuration = 2402; //in seconds

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

/**
 * Callback function for the timer
 * @param distance
 * @param label
 * @returns {Promise<void>}
 */
async function processMainTimer(distance, label) {

    if (distance <= 1) {
        clearInterval(timer);
        breakWindow = windowController.createBreakWindow();
        timerProgress = null
    } else {
        timerProgress = distance;
        tray.setTitle(label);
        if (breakWindow) {
            console.log(breakWindow)
        }
    }
}

function createTimer(initialVal = null) {
    timer = breaksController.createTimer(initialVal ?? timerDuration, processMainTimer);
    trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
}

//application starts
app.whenReady().then(() => {
    createTray();
    createTimer();
});

module.exports.getTimerInstance = () => {
    return timer
}

module.exports.setTimerInstance = (newValue) => {
    timer = newValue
    if (newValue === null) {
        timerProgress = null
    }
}

module.exports.getAppInstance = () => {
    return app
}

module.exports.getTrayInstance = () => {
    return tray
}

module.exports.getTimerProgress = () => {
    return timerProgress
}

module.exports.createTimer = createTimer;