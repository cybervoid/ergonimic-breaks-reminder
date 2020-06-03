//classes declaration
const electron = require('electron');
const BreaksController = require('./lib/BreaksController');
const MenuTemplates = require('./lib/MenuTemplates');
const WindowController = require('./lib/WindowController');

//classes initialization
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const breaksController = new BreaksController();
const windowController = new WindowController(BrowserWindow, app);
const menuTemplate = new MenuTemplates(windowController);

//global variables declaration
let breakWindow, settingsWindow, tray, timer;
const isMac = process.platform === 'darwin';
const timerDuration = 40; //in minutes

// process.env.NODE_ENV = 'production';
if (process.env.NODE_ENV !== 'production') {
    app.commandLine.appendSwitch('remote-debugging-port', '9222');
}

function createTray() {
    tray = new Tray('src/assets/img/icons/tray_icons/IconTemplate.png')
    const contextMenu = Menu.buildFromTemplate(menuTemplate.getTrayMenuTemplate())

    tray.setToolTip('Ergonomic breaks reminder')
    tray.setContextMenu(contextMenu)
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

module.exports.getTimerInstance = () => {
    return timer
}

module.exports.getAppInstance = () => {
    return app
}

app.whenReady().then(() => {
    createTray();
    timer = breaksController.createTimer(timerDuration, processMainTimer);
});