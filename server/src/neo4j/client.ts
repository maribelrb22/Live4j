import neo4j, { Driver, Session } from 'neo4j-driver'
import { getConfiguration } from '../config'
import { Neo4jConfiguration } from '../types'
import { Neo4jClientQueries } from './queries'

export class Neo4jClient {
    private driver!: Driver
    private session!: Session
    private opened: boolean
    public queries: Neo4jClientQueries = new Neo4jClientQueries(this)

    constructor(public configuration: Neo4jConfiguration) {
        this.opened = false
        this.open()
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

    open(): void {
        if (this.opened) {
            return
        }
        this.driver = this.startDriver()
        this.session = this.startSession()
        this.opened = true
        console.log('[4j] connection opened')
    }

    async close(): Promise<void> {
        if (!this.opened) {
            return
        }
        await this.session.close()
        await this.driver.close()
        this.opened = false
        console.log('[4j] connection closed')
    }
}

export const client4j = new Neo4jClient(getConfiguration())
