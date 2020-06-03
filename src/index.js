const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain, Tray} = electron;
const WindowController = require('./lib/WindowController');

const windowController = new WindowController(BrowserWindow, app);

let mainWindow, settingsWindow, tray, timer;
const isMac = process.platform === 'darwin';
const timerDuration = 40; //in minutes

// process.env.NODE_ENV = 'production';

function createTray() {
    tray = new Tray('src/assets/img/icons/tray_icons/IconTemplate.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open', click: async () => {
                windowController.createSettingsWindow()
            }
        },
        {type: 'separator'},
        {
            label: "Start break",
            click: async () => {
                windowController.createBreakWindow();
            }
        },
        {type: 'separator'},
        {
            label: 'Quit',
            click() {
                app.quit();
            }
        }
    ])
    tray.setToolTip('Ergonomic breaks reminder')
    tray.setContextMenu(contextMenu)
}

function startTimer() {

    let duration = timerDuration * 60 * 1000;
    let countDownDate = new Date(Date.now() + (duration)).getTime();
    let i = 0;

    timer = setInterval(() => {
        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;
        i++;

        // Time calculations for days, hours, minutes and seconds
        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        minutes = ('0' + minutes).slice(-2)
        seconds = ('0' + seconds).slice(-2);

        if (distance <= 1) {
            clearInterval(timer);
            windowController.createBreakWindow();
        } else {
            tray.setTitle(`${minutes}:${seconds}`);
        }
    }, 1000)
}

//catch item:add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    settingsWindow.close();
})

app.whenReady().then(() => {
    createTray();
    startTimer();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// app.on('activate', () => {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createMainWindow()
//     }
// });

if (process.env.NODE_ENV !== 'production') {
    app.commandLine.appendSwitch('remote-debugging-port', '9222');
}
