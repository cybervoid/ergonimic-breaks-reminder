//classes declaration
const electron = require('electron');
const breaksController = require('./lib/BreaksController');
const MenuTemplates = require('./lib/MenuTemplates');
const windowController = require('./lib/WindowController');

//classes initialization
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const menuTemplate = new MenuTemplates();

//global variables declaration
let breakWindow, settingsWindow, tray, timer, trayMenu, timerProgress;
let isBreakTimer = false;


const isMac = process.platform === 'darwin';
const timerDuration = 10; //in seconds
// const timerDuration = 2402; //in seconds
// const breakTimerDuration = 10 * 60;
const breakTimerDuration = 8;

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
        //time is up
        clearInterval(timer);
        timerProgress = null

        if (isBreakTimer) {
            createTimer()
            windowController.closeBreakWindow();
        } else {
            console.log('creating break window');
            breakWindow = windowController.createBreakWindow();
            createTimer(breakTimerDuration)
        }
        isBreakTimer = !isBreakTimer;
    } else {
        timerProgress = distance;
        tray.setTitle(label);
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

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