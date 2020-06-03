const main = require('../index');

module.exports = class MenuTemplate {

    getTrayMenuTemplate() {
        return [
            {
                label: 'Open', click: async () => {
                    windowController.createSettingsWindow()
                }
            },
            {type: 'separator'},
            {
                label: "Start break",
                click: async () => {
                    this.windowsController.createBreakWindow();
                }
            },
            {type: 'separator'},
            {
                id: 'tray_start_counter',
                label: "Start counter",
                enabled: false,
                click: async (menuItem) => {
                    main.createTimer();
                    menuItem.enabled = false;
                }
            },
            {
                id: 'tray_pause_counter',
                label: "Pause counter",
                click: async (menuItem) => {
                    main.trayMenu.getMenuItemById('tray_start_counter').enabled = true;
                    menuItem.enabled = false;
                    clearInterval(main.getTimerInstance());
                }
            },
            {
                label: "Stop counter",
                click: async (menuItem) => {
                    clearInterval(main.getTimerInstance());
                    main.getTrayInstance().setTitle('');
                    menuItem.enabled = false;
                    main.trayMenu.getMenuItemById('tray_pause_counter').enabled = false;
                }
            },
            {type: 'separator'},
            {
                label: 'Quit',
                click: () => {
                    main.getAppInstance().quit()
                }
            }
        ]
    };

}