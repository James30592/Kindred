import {CurrAnswerers} from "./currentAnswerers.mjs";


// Stores server variables throughout whole time app is running on server.
export class ServerState {
    spotifyToken;
    currAnswerers;

    constructor() {
        this.currAnswerers = new CurrAnswerers();
    }

    init() {
        this.#initSpotifyAPI();
        this.currAnswerers.init();
    }

    // Gets a token for querying from Spotify API.
    async #initSpotifyAPI() {
        const client_id = '18ddf7eb35004d86b4f9e3ed38604685';
        const client_secret = '239118a54fab4b6c9d45cf1449d3c0cb';
    
        let body = new URLSearchParams({
        "grant_type": "client_credentials"
        });
    
        const fetchResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + 
            client_secret).toString('base64')),
            
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
        });
    
        this.spotifyToken = await fetchResponse.json();

        // Also need to set this token to refresh every hour.........................................................
        
    }
}