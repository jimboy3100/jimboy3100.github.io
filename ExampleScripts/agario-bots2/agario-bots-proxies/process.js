const {spawn} = require('child_process')

function spawnProcess(){
    const botsProcess = spawn('node', ['server.js'])
    botsProcess.stdout.on('data', data => {
        console.log(data.toString())
    })
    botsProcess.stderr.on('data', data => {
        console.log(data.toString())
    })
    botsProcess.on('exit', () => {
        setTimeout(spawnProcess, 1000)
    })
}

spawnProcess()