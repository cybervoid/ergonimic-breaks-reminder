
const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const item = document.querySelector('#setting1').value;
    ipcRenderer.send('item:add', item);
})

