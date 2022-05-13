import { movies, genres } from '../data/setupData.json'
import { client4j } from './neo4j/client'

export async function setup() {
    console.log('[4j/setup] loading initial data')
    console.log('[4j/setup] deleting all entities')
    if (!(await client4j.queries.deleteAll())) {
        console.log('[4j/setup] aborting setup')
        return
    }

    console.log('[4j/setup] creating genres')

    try {
        for (const genre of genres) {
            await client4j.getSession().writeTransaction((tx) => {
                tx.run(`CREATE (n:Genre { id: $id, name: $name })`, genre)
            })
        }
    } catch (e) {
        console.log('[4j/setup] aborting setup')
        return
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
