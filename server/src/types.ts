export type Movie = {
    id: string
    name: string
    releaseDate: string
    rating: number
    language: string
    genres: string[]
}

export type Genre = {
    id: string
    name: string
}

export type Neo4jConfiguration = {
    NEO4J_SERVER: string
    NEO4J_DATABASE: string
    NEO4J_USERNAME: string
    NEO4J_PASSWORD: string
}

export type WssConfiguration = {
    WSS_PORT: number
}

export type GlobalConfiguration = Neo4jConfiguration & WssConfiguration
