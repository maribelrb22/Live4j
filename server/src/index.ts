import { getConfiguration } from './config'
import { setup } from './setup'
import { WebsocketServer } from './wss/server'
import waitOn from 'wait-on'
import { client4j } from './neo4j/client'

waitOn({
    resources: [
        `http://${getConfiguration().NEO4J_SERVER}:7474/`
    ]
})
.then(() => client4j.open())
.then(setup)
.then(() => {
    const wss = new WebsocketServer()
    const { WSS_PORT: port } = getConfiguration()
    wss.open(port)
})
