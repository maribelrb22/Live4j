import { Server } from 'socket.io'
import { client4j } from '../neo4j/client'

export class WebsocketServer {
    private io: Server

    constructor(private port: number = 3000) {
        this.io = new Server()
        this.startListening(this.port)
    }

    private async startListening(port: number) {
        this.io.on('connection', (socket) => {
            /* No operation */
        })
        this.io.listen(3000)
        console.log(await client4j.actions.getAllMovies())
    }

    close() {
        this.io.close()
    }
}
