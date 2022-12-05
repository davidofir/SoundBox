import { useState } from "react";
import { GetEventsByArtistName } from "../../domain/ArtistRepository/ArtistRepository";

export default function ArtistViewModel(){

    const [events,setEvents] = useState([])

    async function getEventsByArtistName(artistName,time){
        const data = await GetEventsByArtistName(artistName,time);
        setEvents(data);
    }
    return{
        events,
        getEventsByArtistName
    }
}