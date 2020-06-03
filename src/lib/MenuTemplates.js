const main = require('../index');

module.exports = class MenuTemplate {

    constructor(WindowsController) {
        this.windowsController = WindowsController;
    }

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
                id: "tray_start_timer",
                label: "Start counter",
                click: async () => {
                    this.windowsController.createBreakWindow();
                }
            },
            {
                id: "tray_stop_timer",
                label: "Stop counter",
                click: async () => {
                    clearInterval(main.getTimerInstance());
                }
            },
            {type: 'separator'},
            {
                id: 'tray_quit',
                label: 'Quit',
                click: () => {
                    main.getAppInstance().quit()
                }
            }
        ]
    };

}