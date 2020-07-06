const {BrowserWindow} = require('electron')

let breakWindow;

module.exports.createBreakWindow = function createBreakWindow() {
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
    })

    return breakWindow
}

module.exports.closeBreakWindow = () => {
    breakWindow.close();
}