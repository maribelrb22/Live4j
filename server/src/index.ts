import { getConfiguration } from './config'
import { WebsocketServer } from './wss/server'

const wss = new WebsocketServer()
const { WSS_PORT: port } = getConfiguration()
wss.open(port)
