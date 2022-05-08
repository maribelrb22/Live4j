import { client4j } from '../neo4j/client'
import { Genre, Movie } from '../types'
import { WebsocketServer } from './server'
import WebSocketConnection from 'ws'

export class WebsocketServerHandlers {
    constructor(public wss: WebsocketServer) {}

    async connection(ws: WebSocketConnection) {
        console.log(
            '[wss/connection] new socket connected, sending individual update'
        )
        ws.on('message', (message: string) =>
            this.message(JSON.parse(message))
        )
        ws.send(
            JSON.stringify({
                type: 'update',
                data: await client4j.queries.getAll()
            })
        )
    }

    async message(message: { type: string; data: any }) {
        switch (message.type) {
            case 'addMovie':
                await this.addMovie(message.data)
                break
            case 'updateMovie':
                await this.updateMovie(message.data)
                break
            case 'deleteMovie':
                await this.deleteMovie(message.data)
                break
            case 'addGenre':
                await this.addGenre(message.data)
                break
            case 'updateGenre':
                await this.updateGenre(message.data)
                break
            case 'deleteGenre':
                await this.deleteGenre(message.data)
                break
        }
        await this.update()
    }

    async addMovie(movie: Omit<Movie, 'id'>) {
        console.log('[wss/movie] adding new movie with data:', movie)
        await client4j.queries.addMovie(movie)
    }

    async updateMovie(movie: Movie) {
        console.log('[wss/movie] updating movie with data:', movie)
        await client4j.queries.updateMovie(movie)
    }

    async deleteMovie(id: number) {
        console.log('[wss/movie] deleting movie with id:', id)
        await client4j.queries.deleteMovie(id)
    }

    async addGenre(genre: Omit<Genre, 'id'>) {
        console.log('[wss/genre] adding new genre with data:', genre)
        await client4j.queries.addGenre(genre)
    }

    async updateGenre(genre: Genre) {
        console.log('[wss/genre] updating genre with data:', genre)
        await client4j.queries.updateGenre(genre)
    }

    async deleteGenre(id: number) {
        console.log('[wss/genre] deleting genre with id:', id)
        await client4j.queries.deleteGenre(id)
    }

    async update() {
        console.log('[wss/update] sending global update')
        this.wss.emitToAll(
            JSON.stringify({
                type: 'update',
                data: await client4j.queries.getAll()
            })
        )
    }
}
