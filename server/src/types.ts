export type Movie = {
    id: number
    name: string
    releaseDate: string
    rating: number
    language: string
    genres?: Set<string>
}

export type Genre = {
    id: number
    name: string
}

export type BelongToRelationship = {
    movieId: number
    genreId: number
}
