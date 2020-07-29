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
        timerProgress = null

        if (this.breakWindowHandler) {
            this.activeTimer = createTimer(TIMER_DURATION, this.processMainTimer)
            this.breakWindowHandler = windowController.closeBreakWindow();
        } else {
            this.initiateBreak()
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

module.exports.initiateBreak = () => {
    this.breakWindowHandler = windowController.createBreakWindow(this.processMainTimer)
    this.activeTimer = createTimer(BREAK_TIMER_DURATION, this.processMainTimer)
}


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

module.exports.getTrayInstance = () => {
    return tray
}

ipcMain.handle('my-invokable-ipc', async (event, ...args) => {
    const result = 'pepe'
    return result
})