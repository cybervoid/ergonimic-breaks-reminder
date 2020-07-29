const main = require('../index');
const {app} = require('electron');

module.exports = class MenuTemplate {

    getTrayMenuTemplate() {
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
                id: 'tray_start_counter',
                label: "Start countdown",
                enabled: false,
                click: async (menuItem) => {
                    menuItem.enabled = false;
                    main.trayMenu.getMenuItemById('tray_pause_counter').enabled = true;
                    main.trayMenu.getMenuItemById('tray_stop_counter').enabled = true;
                    main.controlTimer()
                }
            },
            {
                id: 'tray_pause_counter',
                label: "Pause countdown",
                click: async (menuItem) => {
                    main.trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                    menuItem.enabled = false;
                    const {activeTimer} = require('../index')
                    clearInterval(activeTimer)
                }
            },
            {
                id: 'tray_stop_counter',
                label: "Stop countdown",
                click: async (menuItem) => {
                    main.getTrayInstance().setTitle('');
                    menuItem.enabled = false;
                    main.trayMenu.getMenuItemById('tray_pause_counter').enabled = false;
                    main.trayMenu.getMenuItemById('tray_start_counter').enabled = true;
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
    };

}