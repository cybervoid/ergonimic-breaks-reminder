const electron = require('electron');

const {app, BrowserWindow} = electron;

let mainWindow;

//listen for app to be ready

app.on('ready', () => {
    //create new window
    mainWindow = new BrowserWindow({});

    //load the html for the main window
    mainWindow.loadFile('src/mainWindow.html');
})
