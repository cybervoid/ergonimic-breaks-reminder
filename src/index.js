//classes declaration
const electron = require('electron');
const breaksController = require('./lib/BreaksController');
const MenuTemplates = require('./lib/MenuTemplates');
const windowController = require('./lib/WindowController');
const {TIMER_DURATION, BREAK_TIMER_DURATION} = require('./lib/Constants')
const {createTimer} = require('./lib/TimersController')

//classes initialization
const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const menuTemplate = new MenuTemplates();

//global variables declaration
let breakWindow, settingsWindow, tray, timer, trayMenu, timerProgress;
let isBreakTimer = false;
module.exports.breakWindowHandler = null
module.exports.activeTimer = null

const isMac = process.platform === 'darwin';

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
const processMainTimer = (distance, label) => {

    if (distance <= 1) {
        //time is up
        clearInterval(this.activeTimer);
        timerProgress = null

        if (isBreakTimer) {
            createTimer(TIMER_DURATION, processMainTimer)
            windowController.closeBreakWindow();
            breakWindow = null
        } else {
            breakWindow = windowController.createBreakWindow(processMainTimer);
            // createTimer(BREAK_TIMER_DURATION, processMainTimer)
        }
        isBreakTimer = !isBreakTimer;
    } else {
        timerProgress = distance;
        if (this.breakWindowHandler) {
            windowController.updateBreakTimer(label)
        }
        tray.setTitle(label);
    }
}

module.exports.processMainTimer = processMainTimer

// function createTimer(initialVal = null) {
//     timer = breaksController.createTimer(initialVal ?? TimerDuration, processMainTimer);
//     trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
// }

//application starts
app.whenReady().then(() => {
    createTray();
    this.activeTimer = createTimer(TIMER_DURATION, processMainTimer);
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

ipcMain.handle('my-invokable-ipc', async (event, ...args) => {
    const result = 'pepe'
    return result
})