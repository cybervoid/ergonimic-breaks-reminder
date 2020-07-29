const {ipcRenderer} = require('electron')

async function myFunction() {
    const result = await ipcRenderer.invoke('my-invokable-ipc', 'arg1', 'arg2')
    console.log(result);
}

function init() {
    console.log(`running init`)
    ipcRenderer.on('ping', (event, message) => {
        console.log('timer: ' + message.status)
    });
}


//document ready replacement
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}