import { Socket } from 'socket.io'
import { client4j } from '../neo4j/client'
import { Genre, Movie } from '../types'
import { WebsocketServer } from './server'

export class WebsocketServerHandlers {
    constructor(public wss: WebsocketServer) {}

    async connection(socket: Socket) {
        console.log('[wss/connection] new socket connected, sending individual update')
        socket.emit('update', await client4j.queries.getAll())
    }

    async addMovie(movie: Omit<Movie, 'id'>, answerBack: (response: boolean) => void) {
        console.log('[wss/movie] adding new movie with data:', movie)
        answerBack(await client4j.queries.addMovie(movie))
    }

    async updateMovie(movie: Movie, answerBack: (response: boolean) => void) {
        console.log('[wss/movie] updating movie with data:', movie)
        answerBack(await client4j.queries.updateMovie(movie))
    }

    async deleteMovie(id: number, answerBack: (response: boolean) => void) {
        console.log('[wss/movie] deleting movie with id:', id)
        answerBack(await client4j.queries.deleteMovie(id))
    }

    async addGenre(genre: Omit<Genre, 'id'>, answerBack: (response: boolean) => void) {
        console.log('[wss/genre] adding new genre with data:', genre)
        answerBack(await client4j.queries.addGenre(genre))
    }

    async updateGenre(genre: Genre, answerBack: (response: boolean) => void) {
        console.log('[wss/genre] updating genre with data:', genre)
        answerBack(await client4j.queries.updateGenre(genre))
    }

    async deleteGenre(id: number, answerBack: (response: boolean) => void) {
        console.log('[wss/genre] deleting genre with id:', id)
        answerBack(await client4j.queries.deleteGenre(id))
    }

    async update() {
        console.log('[wss/update] sending global update')
        this.wss.emitToAll('update', await client4j.queries.getAll())
    }
}
