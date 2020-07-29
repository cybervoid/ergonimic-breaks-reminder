const {BrowserWindow} = require('electron')

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
    breakWindow.loadFile('src/views/breakWindow.html');

    // Open the DevTools.
    if (process.env.NODE_ENV !== 'production') {
        breakWindow.webContents.openDevTools();
    }

    breakWindow.on('close', () => {
        breakWindow = null;
    });

    breakWindow.webContents.on('did-finish-load', this.updateBreakTimer);

    return breakWindow
}

module.exports.closeBreakWindow = () => {
    breakWindow.close();
    breakWindow = null;
    return breakWindow
}

module.exports.updateBreakTimer = (label = false) => {
    if (label) {
        try {
            breakWindow.webContents.send('break_timer', {'status': label})
        } catch (e) {
            console.log(`Error sending message to break window: ${e.message}`)
        }
    }
}