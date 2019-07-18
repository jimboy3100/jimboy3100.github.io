const child_process = require('child_process')

function startBots(){
    const process = child_process.spawn('node', ['server.js'])
    process.stdout.on('data', data => {
        console.log(data.toString())
    })
    process.stderr.on('data', data => {
        console.log(data.toString())
    })
    process.on('exit', code => {
        setTimeout(startBots, 1000)
    })
}

startBots()
