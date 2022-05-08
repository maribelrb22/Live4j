import { Server, Socket } from 'socket.io'
import { WebsocketServerHandlers } from './handlers'

export class WebsocketServer {
    private io: Server
    private opened: boolean
    private handlers: WebsocketServerHandlers = new WebsocketServerHandlers(
        this
    )

    constructor() {
        this.opened = false
        this.io = new Server({
            cors: {
                origin: '*'
            }
        })
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
        this.addListeners()
        this.io.listen(port)
        this.opened = true
        console.log(`[wss4j] ready at ::${port}`)
    }

    private addListeners(): void {
        this.io.on('connection', async (socket: Socket) =>
            await this.handlers.connection(socket)
        )
        this.io.on('addMovie', async (data, callback: (response: any) => void) =>
            await this.handlers.addMovie(data, callback)
        )
        this.io.on('updateMovie', async (data, callback: (response: any) => void) =>
            await this.handlers.updateMovie(data, callback)
        )
        this.io.on('deleteMovie', async (data, callback: (response: any) => void) =>
            await this.handlers.deleteMovie(data, callback)
        )
        this.io.on('addGenre', async (data, callback: (response: any) => void) =>
            await this.handlers.addGenre(data, callback)
        )
        this.io.on('updateGenre', async (data, callback: (response: any) => void) =>
            await this.handlers.updateGenre(data, callback)
        )
        this.io.on('deleteGenre', async (data, callback: (response: any) => void) =>
            await this.handlers.deleteGenre(data, callback)
        )
    }

    close(): void {
        if (!this.opened) {
            return
        }
        console.log(`[wss4j] closing`)
        this.io.removeAllListeners()
        this.io.close()
        this.opened = false
        console.log(`[wss4j] closed`)
    }

    emitToAll(event: string, data: any): void {
        this.io.sockets.emit(event, data)
    }
}
