const {BrowserWindow} = require('electron')
const BreaksController = require('./BreaksController')
const {BREAK_TIMER_DURATION} = require('./Constants')
const {createTimer} = require('./TimersController')

let breakWindow;

module.exports.createBreakWindow = function createBreakWindow(callback) {
    // Create the browser window.
    breakWindow = new BrowserWindow({
        alwaysOnTop: true,
        fullscreen: true,
        // modal: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    breakWindow.loadFile('src/views/break.html');

    // Open the DevTools.
    if (process.env.NODE_ENV !== 'production') {
        breakWindow.webContents.openDevTools();
    }

    breakWindow.on('close', () => {
        breakWindow = null;
    });

    breakWindow.webContents.on('did-finish-load', this.updateBreakTimer);
    createTimer(BREAK_TIMER_DURATION, callback)
    return breakWindow
}

module.exports.closeBreakWindow = () => {
    breakWindow.close();
    breakWindow = null;
}

module.exports.updateBreakTimer = (label = false) => {
    if (label) {
        try {
            breakWindow.webContents.send('ping', {'status': label})
        } catch (e) {
            console.log(`Error sending message to break window: ${e.message}`)
        }
    }
}