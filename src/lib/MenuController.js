const main = require('../index');
const {app, Menu, Tray} = require('electron');

let trayMenu;

module.exports.createMenuTray = () => {
    const tray = new Tray('src/assets/img/icons/tray_icons/IconTemplate.png')
    tray.setToolTip('Ergonomic breaks reminder')

    trayMenu = Menu.buildFromTemplate(getMenuTemplate())
    tray.setContextMenu(trayMenu)

    return tray
}

function getMenuTemplate(tray) {
    return [
        {
            label: 'Open', click: async () => {
                // windowController.createSettingsWindow()
            }
        },
        {type: 'separator'},
        {
            label: "Go on break",
            click: async () => {
                main.initiateBreak()
            }
        },
        {type: 'separator'},
        {
            label: "Start countdown",
            id: 'tray_start_counter',
            enabled: false,
            click: async (menuItem) => {
                menuItem.enabled = false;
                trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
                trayMenu.getMenuItemById('tray_stop_counter').enabled = true;
                main.controlTimer()
            }
        },
        {
            label: "Pause countdown",
            id: 'tray_pause_counter',
            click: async (menuItem) => {
                trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                menuItem.enabled = false;
                const {activeTimer} = require('../index')
                clearInterval(activeTimer)
            }
        },
        {
            id: 'tray_stop_counter',
            label: "Stop countdown",
            click: async (menuItem) => {
                main.menuTray.setTitle('');
                menuItem.enabled = false;
                trayMenu.getMenuItemById('tray_pause_counter').enabled = false;
                trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                main.controlTimer(false)
            }
        },
        {type: 'separator'},
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ]
}

module.exports.resetTimerMenu = () => {
    trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
    trayMenu.getMenuItemById('tray_stop_counter').enabled = true;
    trayMenu.getMenuItemById('tray_start_counter').enabled = false;
}