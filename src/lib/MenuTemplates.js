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
                label: 'Quit',
                click() {
                    app.quit();
                }
            }
        ]
    };

}