import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'

/*
{
    nodes: [
        { id: 1, label: "Node 1", title: "node 1" },
        { id: 2, label: "Node 2", title: "node 2" },
        { id: 3, label: "Node 3", title: "node 3" },
        { id: 4, label: "Node 4", title: "node 4" },
        { id: 5, label: "Node 5", title: "node 5" }
    ],
    edges: [
        { id: 1, from: 1, to: 2, label: "arista 1" },
        { id: 2, from: 1, to: 3, label: "arista 2" },
        { id: 3, from: 2, to: 4, label: "arista 3" },
        { id: 4, from: 2, to: 5, label: "arista 4" }
    ]
}
*/

const getInitialContext = () => ({
    nodes: [],
    edges: [],
    movies: {},
    genres: {}
})

export const GraphContext = createContext(null)

export const GraphContextProvider = ({ children }) => {
    const [ready, setReady] = useState(false)
    const [graph, setGraph] = useState(getInitialContext())
    const [socket, setSocket] = useState(null)
    const [actions, setActions] = useState(null)

    useEffect(() => {
        setSocket(io(process.env.REACT_APP_WSS4J_ADDRESS))
    }, [])

    useEffect(() => {
        if (!socket) {
            return
        }

        socket.on('update', ({ movies, genres }) => {
            /* Empty */
        })

        setActions({
            createMovie(movie) {
                socket.emit('addMovie', movie, (response) => {
                    console.log(`[client] tried to create movie: ${response ? 'OK' : 'FAIL'}`)
                })
            },
            updateMovie(movie) {
                socket.emit('updateMovie', movie, (response) => {
                    console.log(`[client] tried to update movie: ${response ? 'OK' : 'FAIL'}`)
                })
            },
            deleteMovie(id) {
                socket.emit('deleteMovie', id, (response) => {
                    console.log(`[client] tried to delete movie: ${response ? 'OK' : 'FAIL'}`)
                })
            },
            createGenre(genre) {
                socket.emit('addGenre', genre, (response) => {
                    console.log(`[client] tried to create genre: ${response ? 'OK' : 'FAIL'}`)
                })
            },
            updateGenre(genre) {
                socket.emit('updateGenre', genre, (response) => {
                    console.log(`[client] tried to update genre: ${response ? 'OK' : 'FAIL'}`)
                })
            },
            deleteGenre(id) {
                socket.emit('deleteGenre', id, (response) => {
                    console.log(`[client] tried to delete genre: ${response ? 'OK' : 'FAIL'}`)
                })
            }
        })

        setReady(true)
    }, [socket])

    return <GraphContext.Provider value={{ ready, graph, actions }}>
        { children }
    </GraphContext.Provider>
}
