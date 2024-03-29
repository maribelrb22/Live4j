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

    private cacheMovies(movies: Movie[], silent = false) {
        this.cache.movies = movies
        this.cache.isMovieCacheInvalidated = false
        !silent && console.log(`[4j/cache] movie cache has been restored`)
    }

    private cacheGenres(genres: Genre[], silent = false) {
        this.cache.genres = genres
        this.cache.isGenreCacheInvalidated = false
        !silent && console.log(`[4j/cache] genre cache has been restored`)
    }

    private invalidateMovies(silent = false) {
        this.cache.isMovieCacheInvalidated = true
        !silent && console.log(`[4j/cache] invalidated movie cache`)
    }

    private invalidateGenres(silent = false) {
        this.cache.isGenreCacheInvalidated = true
        !silent && console.log(`[4j/cache] invalidated genre cache`)
    }

    async getAllMovies(): Promise<Movie[]> {
        if (!this.cache.isMovieCacheInvalidated) {
            console.log('[4j/cache] using movie cache')
            return this.cache.movies
        }

        let moviesWithGenres, moviesWithoutGenres: QueryResult
        try {
            moviesWithGenres = await this.client4j
                .getSession()
                .writeTransaction((tx) =>
                    tx.run(`MATCH (n:Movie)-[:BELONGS_TO]->(m:Genre)
                            RETURN {
                                id: n.id,
                                name: n.name,
                                releaseDate: n.releaseDate,
                                rating: n.rating,
                                language: n.language,
                                genres: collect(m.id)
                            } as movie`)
                )

            moviesWithoutGenres = await this.client4j
                .getSession()
                .writeTransaction((tx) =>
                    tx.run(
                        `MATCH (n:Movie) WHERE NOT (n)-[:BELONGS_TO]->(:Genre)
                        RETURN {
                            id: n.id,
                            name: n.name,
                            releaseDate: n.releaseDate,
                            rating: n.rating,
                            language: n.language
                        } as movie`
                    )
                )
        } catch (e) {
            return []
        }

        const movies: Movie[] = [
            ...this.mapResultToArray<Movie>(moviesWithGenres, 'movie'),
            ...this.mapResultToArray<Movie>(moviesWithoutGenres, 'movie').map(
                (movie) => ({
                    ...movie,
                    genres: []
                })
            )
        ]
        setTimeout(() => this.cacheMovies(movies), 0)
        return movies
    }

    async addMovie(movie: Omit<Movie, 'id'>): Promise<boolean> {
        const createdMovie: Movie = {
            ...movie,
            id: uuidv4()
        }

        this.invalidateMovies()

        try {
            await this.client4j.getSession().writeTransaction((tx) => {
                tx.run(
                    `CREATE (n:Movie { id: $id, name: $name, releaseDate: $releaseDate, rating: $rating, language: $language })`,
                    createdMovie
                )
            })
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }

        return await this.matchMovieWithGenres(createdMovie)
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

                tx.run(
                    `MATCH (:Movie { id: $id })-[r]->(:Genre)
                    DELETE r`,
                    movie
                )
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
                movie.genres.forEach((genreId) => {
                    tx.run(
                        `MATCH (movie:Movie { id: $movieId }), (genre:Genre { id: $genreId })
                         CREATE (movie)-[r:BELONGS_TO]->(genre)`,
                        {
                            movieId: movie.id,
                            genreId
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
                    { id }
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
            console.log('[4j/cache] using genre cache')
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
                    { id }
                )
            )
            return true
        } catch (e) {
            console.log(`[4j/query] error ocurred: ${e}`)
            return false
        }
    }

    async getAll(): Promise<{
        movies: Record<string, Movie>
        genres: Record<string, Genre>
    }> {
        const movies: Record<string, Movie> = (
            await this.getAllMovies()
        ).reduce(
            (acc, movie) => ({
                ...acc,
                [movie.id]: movie
            }),
            {}
        )
        const genres: Record<string, Genre> = (
            await this.getAllGenres()
        ).reduce(
            (acc, genre) => ({
                ...acc,
                [genre.id]: genre
            }),
            {}
        )
        return {
            movies,
            genres
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
