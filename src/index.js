const electron = require('electron');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, settingsWindow;
const isMac = process.platform === 'darwin';


//listen for app to be ready

function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('src/mainWindow.html');
    mainWindow.on('closed', app.quit);
    // Open the DevTools.
    // win.webContents.openDevTools()
}

function createMainMenu(){

    //if MAC, add empty object to menu
    if(process.platform === 'darwin'){
        // mainMenuTemplate.unshift({})
    }

    let mainMenuTemplate = [
        // { role: 'appMenu' }
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                {
                    label: 'Settings',
                    click(){
                        createSettingsWindow()
                    }
                }
            ],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startspeaking' },
                            { role: 'stopspeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { role: 'zoomin' },
                { role: 'zoomout' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [
                    { role: 'close' }
                ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ]

    //Add developer tools item if not in prod
    if(process.env.NODE_ENV !== 'production'){
        mainMenuTemplate.push({
            label: "Developer Tool",
            submenu: [
                {
                    label: "Toggle DevTools",
                    accelerator: isMac ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                }
            ]
        });
    }

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}

function createSettingsWindow(){
    settingsWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    settingsWindow.loadFile('src/views/settingsWindow.html')

    settingsWindow.on('close', () => {
        settingsWindow = null;
    })
}

//catch item:add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    settingsWindow.close();
})

app.whenReady().then( () => {
    createMainWindow();
    createMainMenu();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})
