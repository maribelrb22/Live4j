import WebSocketConnection, { WebSocketServer } from 'ws'
import { WebsocketServerHandlers } from './handlers'

export class WebsocketServer {
    private wss!: WebSocketServer
    private opened: boolean
    private handlers: WebsocketServerHandlers = new WebsocketServerHandlers(
        this
    )

    constructor() {
        this.opened = false
        console.log('[wss] ready')
    }

    isOpened(): boolean {
        return this.opened
    }

    open(port: number): void {
        if (this.opened) {
            return
        }
        console.log(`[wss4j] trying to open at ::${port}`)
        this.wss = new WebSocketServer({
            port
        })
        this.wss.on('connection', (ws) => this.handlers.connection(ws))
        this.opened = true
        console.log(`[wss4j] ready at ::${port}`)
    }

    close(): void {
        if (!this.opened) {
            return
        }
        console.log(`[wss4j] closing`)
        this.wss.removeAllListeners()
        this.wss.close()
        this.opened = false
        console.log(`[wss4j] closed`)
    }

    emitToAll(data: any): void {
        this.wss.emit('message', data)
    }
}
