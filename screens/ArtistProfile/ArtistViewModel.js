import { useState } from "react";
import { GetEventArtistProfile, GetEventsByArtistName } from "../../domain/ArtistRepository/ArtistRepository";

export default function ArtistViewModel(){

    const [events,setEvents] = useState([])
    const [artistProfile,setArtistProfile] = useState({});
    async function getEventsByArtistName(artistName,time){
        const data = await GetEventsByArtistName(artistName,time);
        setEvents(data);
    }
    function getArtistProfile(){
        const artist = GetEventArtistProfile();
        setArtistProfile(artist);
    }
    return{
        events,
        getEventsByArtistName,
        artistProfile,
        getArtistProfile
    }
}