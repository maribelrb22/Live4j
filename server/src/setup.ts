import initialData from '../data/initialData.json'
import { client4j } from './neo4j/client'

async function setup() {
    console.log('Loading initial data in the database...')
    try {
        await client4j.getSession().writeTransaction((tx) => {
            tx.run('MATCH (n) DETACH DELETE n')

            initialData.forEach((movie) =>
                tx.run(
                    'CREATE (n:Movie { name: $name, releaseDate: $releaseDate, rating: $rating, language: $language })',
                    movie
                )
            )

            const genres = initialData.reduce((acc, movie) => {
                movie.genres.forEach((genre) => acc.add(genre))
                return acc
            }, new Set<string>())

            genres.forEach((genre) =>
                tx.run('CREATE (n:Genre { name: $name })', { name: genre })
            )

            initialData.forEach((movie) => {
                movie.genres.forEach((genre) => {
                    tx.run(
                        `
                    MATCH
                        (movie:Movie),
                        (genre:Genre)
                    WHERE movie.name = $movieName AND genre.name = $genre
                    CREATE (movie)-[r:BELONGS_TO]->(genre)
                `,
                        {
                            movieName: movie.name,
                            genre: genre
                        }
                    )
                })
            })
        })
    } catch (e) {
        console.error(`An unexpected error has ocurred: ${e}`)
    }
    console.log('Data loaded successfully')
}

setup()
    .then(() => client4j.close())
    .then(() => process.exit())
