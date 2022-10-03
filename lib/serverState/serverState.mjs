import { CurrAnswerers } from "./components/currentAnswerers.mjs";
import { CategoryType } from "../../models/categoryType.mjs";
import { CategoryInfo } from "../../public/sharedJs/categoryInfo.mjs";



// Stores server variables throughout whole time app is running on server.
export class ServerState {
    spotifyToken;
    igdbToken;
    currAnswerers;
    allCategories;
    allCategoriesList;

    constructor() {
        this.currAnswerers = new CurrAnswerers();
    }

    async init() {
        this.#initAPItokens();
        this.currAnswerers.init();
        await this.#initAllCategories();
    }

    // Store copy of all category types and their categories on server. At the 
    // minute just do this once at server start but later on add interface for 
    // updating categories / questions in admin web interface and have this update then.
    async #initAllCategories() {
        this.allCategories = await CategoryType.find({}).exec();
    }

    // Gets a token for querying from Spotify API.
    async #initAPItokens() {
        await this.#initSpotifyToken();
        await this.#initIGDBToken();
    }

    async #initIGDBToken() {
        const client_id = process.env.IGDB_ID;
        const client_secret = process.env.IGDB_SECRET;

        const tokenRoute = `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;

        const fetchResponse = await fetch(tokenRoute, {
            method: "POST",
        });

        this.igdbToken = await fetchResponse.json();

        setTimeout(() => {
            this.#initIGDBToken();
        }, this.igdbToken.expires_in - 500000);
    }

    async #initSpotifyToken() {
        const client_id = process.env.SPOTIFY_ID;
        const client_secret = process.env.SPOTIFY_SECRET;
    
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

        // Get a new token in another 55 mins since it expires in an hour.
        setTimeout(() => {
            this.#initSpotifyToken();
        }, 3300000);
    }
}

export const serverState = new ServerState();