import movies from '../data/movies.json'
import { client4j } from './neo4j/client'

async function setup() {
    console.log('[4j/setup] loading initial data')
    console.log('[4j/setup] deleting all entities')
    if (!(await client4j.queries.deleteAll())) {
        console.log('[4j/setup] aborting setup')
        return
    }

    console.log('[4j/setup] creating genres')
    const genres = movies.reduce((acc, movie) => {
        movie.genres.forEach((genre) => acc.add(genre))
        return acc
    }, new Set<string>())

    const genresList = Array.from(genres)
    for (const genreName of genresList) {
        if (!(await client4j.queries.addGenre({ name: genreName }))) {
            console.log('[4j/setup] aborting setup')
            return
        }
    }

    console.log('[4j/setup] creating movies and relationships')

    for (const movie of movies) {
        if (!(await client4j.queries.addMovie(movie))) {
            console.log('[4j/setup] aborting setup')
            return
        }
    }

    console.log('[4j/setup] data loaded successfully')
}

setup()
    .then(() => client4j.close())
    .then(() => process.exit())
