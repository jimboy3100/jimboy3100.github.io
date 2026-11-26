const {spawn} = require('child_process')

function spawnProcess(){
    const botsProcess = spawn('node', ['server.js'])
    botsProcess.stdout.on('data', data => {
        console.log(data.toString())
    })
    botsProcess.stderr.on('data', data => {
        console.log(data.toString())
    })
    botsProcess.on('exit', (code) => {
        if (code !== 0) setTimeout(spawnProcess, 1000)
        else console.log('[PROCESS] Clean exit, not restarting')
    })
}

spawnProcess()