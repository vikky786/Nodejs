const electron = require('electron')

const {app, BrowserWindow} = electron

const path = require('path')

const url = require('url')


app.on('ready', ()=>{
    let win = new BrowserWindow({
        width:800,
        heigth:600
    })

    win.loadURL(url.format({
    pathname: path.join(__dirname, 'chat.html'),
    protocol: 'file:',
    slashes: true
  }))
}) 