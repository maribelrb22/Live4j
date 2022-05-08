import { QueryResult } from 'neo4j-driver'
import { v4 as uuidv4 } from 'uuid'
import { Genre, Movie } from '../types'
import { Neo4jClient } from './client'

export class Neo4jClientQueries {
    constructor(public client4j: Neo4jClient) {}

    private cache: {
        movies: Movie[]
        isMovieCacheInvalidated: boolean
        genres: Genre[]
        isGenreCacheInvalidated: boolean
    } = {
        movies: [],
        isMovieCacheInvalidated: true,
        genres: [],
        isGenreCacheInvalidated: true
    }

    private mapResultToArray<T>(result: QueryResult, key: string): T[] {
        return result.records.map((record) => record.toObject()[key] as T)
    }

    private cacheMovies(movies: Movie[], silent = true) {
        this.cache.movies = movies
        this.cache.isMovieCacheInvalidated = false
        !silent && console.log(`[4j/cache] movie cache has been restored`)
    }

    private cacheGenres(genres: Genre[], silent = true) {
        this.cache.genres = genres
        this.cache.isGenreCacheInvalidated = false
        !silent && console.log(`[4j/cache] genre cache has been restored`)
    }

    private invalidateMovies(silent = true) {
        this.cache.isMovieCacheInvalidated = true
        !silent && console.log(`[4j/cache] invalidated movie cache`)
    }

    private invalidateGenres(silent = true) {
        this.cache.isGenreCacheInvalidated = true
        !silent && console.log(`[4j/cache] invalidated genre cache`)
    }

    async getAllMovies(): Promise<Movie[]> {
        if (!this.cache.isMovieCacheInvalidated) {
            return this.cache.movies
        }

        let result: QueryResult
        try {
            result = await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(`MATCH (n:Movie)
                        RETURN {
                            id: n.id,
                            name: n.name,
                            releaseDate: n.releaseDate,
                            rating: n.rating,
                            language: n.language,
                            genres: collect(m.id)
                        } as movie`)
            )
        } catch (e) {
            return []
        }

        const movies: Movie[] = this.mapResultToArray(result, 'movie')
        setTimeout(() => this.cacheMovies(movies), 0)
        return movies
    }

    async addMovie(movie: Omit<Movie, 'id'>): Promise<boolean> {
        try {
            const createdMovie: Movie = {
                ...movie,
                id: uuidv4()
            }

            this.invalidateMovies()
            await this.client4j.getSession().writeTransaction((tx) => {
                tx.run(
                    `CREATE (n:Movie { id: $id, name: $name, releaseDate: $releaseDate, rating: $rating, language: $language })`,
                    createdMovie
                )
            })
            return await this.matchMovieWithGenres(createdMovie)
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async updateMovie(movie: Movie): Promise<boolean> {
        try {
            this.invalidateMovies()
            await this.client4j.getSession().writeTransaction((tx) => {
                tx.run(
                    `MATCH (n:Movie { id: $id })
                     SET n.name = $name, n.releaseDate = $releaseDate, n.rating = $rating, n.language = $language`,
                    movie
                )

                tx.run(`
                    MATCH (:Movie { id: $id })-[r]->(:Genre)
                    DELETE r
                `)
            })
            return await this.matchMovieWithGenres(movie)
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async matchMovieWithGenres(movie: Movie): Promise<boolean> {
        try {
            await this.client4j.getSession().writeTransaction((tx) => {
                movie.genres.forEach((genre) => {
                    tx.run(
                        `MATCH (movie:Movie { id: $movieId }), (genre:Genre { name: $genreName })
                         CREATE (movie)-[r:BELONGS_TO]->(genre)`,
                        {
                            movieId: movie.id,
                            genreName: genre
                        }
                    )
                })
            })
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async deleteMovie(id: number): Promise<boolean> {
        try {
            this.invalidateMovies()
            await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(
                    `MATCH (n:Movie { id: $id })
                     DETACH DELETE n`,
                    id
                )
            )
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async getAllGenres(): Promise<Genre[]> {
        if (!this.cache.isGenreCacheInvalidated) {
            return this.cache.genres
        }

        let result: QueryResult
        try {
            result = await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(`MATCH (n:Genre)
                        RETURN {
                            id: n.id,
                            name: n.name
                        } as genre`)
            )
        } catch (e) {
            return []
        }

        const genres: Genre[] = this.mapResultToArray(result, 'genre')
        setTimeout(() => this.cacheGenres(genres), 0)
        return genres
    }

    async addGenre(genre: Omit<Genre, 'id'>): Promise<boolean> {
        try {
            this.invalidateGenres()
            await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(`CREATE (n:Genre { id: $id, name: $name })`, {
                    ...genre,
                    id: uuidv4()
                })
            )
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async updateGenre(genre: Genre): Promise<boolean> {
        try {
            this.invalidateGenres()
            await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(
                    `MATCH (n:Genre { id: $id })
                     SET n.name = $name`,
                    genre
                )
            )
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async deleteGenre(id: number): Promise<boolean> {
        try {
            this.invalidateMovies()
            this.invalidateGenres()
            await this.client4j.getSession().writeTransaction((tx) =>
                tx.run(
                    `MATCH (n:Genre { id: $id })
                     DETACH DELETE n`,
                    id
                )
            )
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async getAll(): Promise<{ movies: Movie[]; genres: Genre[] }> {
        return {
            movies: await this.getAllMovies(),
            genres: await this.getAllGenres()
        }
    }

    async deleteAll(): Promise<boolean> {
        try {
            await this.client4j.getSession().writeTransaction((tx) => {
                tx.run('MATCH (n) DETACH DELETE n')
            })
            this.invalidateMovies()
            this.invalidateGenres()
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }
}
