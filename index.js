const alfy = require('alfy')
const fs = require('fs')
const os = require('os')
const path = require('path')

const connections = (() => {
    let connections = alfy.cache.get('connections')
    if (connections) {
        return connections
    }

    const jsonPath = path.join(os.homedir(), 'Library/Application Support/Tinkerun/app/connections.json')
    const data = JSON.parse(fs.readFileSync(jsonPath))
    delete data['quick_connection']

    connections = Object.values(data)

    alfy.cache.set('connections', connections, {maxAge: 5000})
    return connections
})()

let items = connections
if (alfy.input) {
    items = alfy.inputMatches(connections, 'name')
}	

alfy.output(items.map(element => ({
    title: element.name,
    subtitle: element.command,
    arg: element.id,
    icon: {
        path: element.is_over_ssh ? 'assets/cloud.png' : 'assets/desktop.png',
    }
})))