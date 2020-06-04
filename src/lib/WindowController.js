module.exports = class WindowsController {

    constructor(browserWindow, app) {
        this.app = app;
        this.BrowserWindow = browserWindow;
    }

    createBreakWindow() {
        // Create the browser window.
        let breakWindow = new this.BrowserWindow({
            alwaysOnTop: true,
            fullscreen: true,
            modal: true,
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

    createSettingsWindow() {
        // Create the browser window.
        let settingsWindow = new this.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        })

        // and load the index.html of the app.
        settingsWindow.loadFile('src/views/settings.html');

        // Open the DevTools.
        if (process.env.NODE_ENV !== 'production') {
            settingsWindow.webContents.openDevTools();
        }

        settingsWindow.on('close', () => {
            settingsWindow = null;
        })
        return settingsWindow
    }
}