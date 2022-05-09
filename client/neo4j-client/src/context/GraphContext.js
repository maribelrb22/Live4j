import { createContext, useEffect, useState } from "react";

const getInitialGraph = () => ({
  nodes: [],
  edges: [],
  movies: {},
  genres: {},
});

export const GraphContext = createContext(null);

export const GraphContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [graph, setGraph] = useState(getInitialGraph());
  const [actions, setActions] = useState(null);
  const [isReady, setIsReady] = useState(false);

  function onUpdate({ movies, genres }) {
    const nodes = [];
    const edges = [];

    Object.values(movies).forEach((movie, x) => {
      nodes.push({
        id: movie.id,
        label: movie.name,
        type: "movie",
        color: "#ff8888",
      });

      movie.genres.forEach((genreId, y) => {
        edges.push({
          id: `${x}-${y}`,
          from: movie.id,
          to: genreId,
        });
      });
    });
    
    Object.values(genres).forEach((genre) => {
      nodes.push({
        id: genre.id,
        label: genre.name,
        type: "genre",
        color: "#88ff88",
      });
    });

    setGraph({
      nodes,
      edges,
      movies,
      genres,
    });
  }

  useEffect(() => {
    const wsocket = new WebSocket(`ws://${process.env.REACT_APP_WSS4J_ADDRESS}`);
    setSocket(wsocket);
  }, []);

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.onmessage = ({ data }) => {
      const event = JSON.parse(data);
      if (event.type === "update") {
        onUpdate(event.data);
      }
    };

    setActions({
      addMovie(movie) {
        socket.send(JSON.stringify({ type: 'addMovie', data: movie }));
      },
      updateMovie(movie) {
        socket.send(JSON.stringify({ type: 'updateMovie', data: movie }));
      },
      deleteMovie(id) {
        socket.send(JSON.stringify({ type: 'deleteMovie', data: id }));
      },
      addGenre(genre) {
        socket.send(JSON.stringify({ type: 'addGenre', data: genre }));
      },
      updateGenre(genre) {
        socket.send(JSON.stringify({ type: 'updateGenre', data: genre }));
      },
      deleteGenre(id) {
        socket.send(JSON.stringify({ type: 'deleteGenre', data: id }));
      },
    });

    setIsReady(true);
  }, [socket]);

  return (
    <GraphContext.Provider value={{ graph, isReady, actions }}>
      {children}
    </GraphContext.Provider>
  );
};
