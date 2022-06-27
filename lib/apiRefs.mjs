// apiRef key, value pairs. DB holds key for each questions list, this is used 
// to store and retrieve the relevant api keys.
export const apiRefs = {
    0: {
        name: "TMDB",
        key: "84c6fe840210161c52e9a52c9cc129bb",
        path: `https://api.themoviedb.org/3/discover/movie?sort_by=vote_count.desc&api_key=`,
        pageAppend: "&page=",
        idField: "id"
        // path: `https://api.themoviedb.org/3/discover/movie?api_key=${TMDBKey}&sort_by=vote_count.desc&page=${currPage}`
    },

    1: {
        name: "test2",
        key: "test2",
        path: "test2"
    }
};