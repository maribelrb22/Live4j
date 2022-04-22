import { QueryResult } from 'neo4j-driver'
import { Genre, Movie } from '../types'
import { Neo4jClient } from './client'

export class Neo4jClientActions {
    constructor(public client4j: Neo4jClient) {}

    async getAllMovies(): Promise<Array<Movie>> {
        let result: QueryResult
        try {
            result = await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(`
                        MATCH (n) WHERE n:Movie
                        RETURN {
                            id: ID(n),
                            name: n.name,
                            releaseDate: n.releaseDate,
                            rating: n.rating,
                            language: n.language
                        } as movie`)
            )
        } catch (e) {
            return []
        }

        const records = result.records.map(
            (record) => record.toObject().movie as Movie
        )
        return records
    }

    async getAllGenres(): Promise<Array<Genre>> {
        let result: QueryResult
        try {
            result = await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(`
                        MATCH (n) WHERE n:Genre
                        RETURN {
                            id: ID(n),
                            name: n.name
                        } as genre`)
            )
        } catch (e) {
            return []
        }

        const records = result.records.map(
            (record) => record.toObject().genre as Genre
        )
        return records
    }
}
