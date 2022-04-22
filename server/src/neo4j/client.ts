import neo4j, { Driver, Session } from 'neo4j-driver'
import { Neo4jClientActions } from './actions'
import { getNeo4jConfiguration } from './config'
import { Neo4jConfiguration } from './types'

export class Neo4jClient {
    private driver: Driver
    private session: Session
    public actions: Neo4jClientActions = new Neo4jClientActions(this)

    constructor(public configuration: Neo4jConfiguration) {
        this.driver = this.startDriver()
        this.session = this.startSession()
    }

    private startDriver() {
        return neo4j.driver(
            this.configuration.NEO4J_SERVER,
            neo4j.auth.basic(
                this.configuration.NEO4J_USERNAME,
                this.configuration.NEO4J_PASSWORD
            )
        )
    }

    private startSession() {
        return this.driver.session({
            database: this.configuration.NEO4J_DATABASE,
            defaultAccessMode: neo4j.session.WRITE
        })
    }

    getSession() {
        return this.session
    }

    async close(): Promise<void> {
        await this.driver.close()
    }
}

export const client4j = new Neo4jClient(getNeo4jConfiguration())
