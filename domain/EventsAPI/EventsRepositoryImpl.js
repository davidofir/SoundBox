import { REACT_APP_EVENTS_API_SECRET } from '@env';

const eventsURL = 'https://rest.bandsintown.com/artists';
let artistData = {};
let data = [];

export default async function GetEventsByArtistNameImpl(artistName, time) {
    data = [];

    // URL encode the artist's name
    const encodedArtistName = encodeURIComponent(artistName);
    
    // Fetch the artist details
    const response = await fetch(`${process.env.REACT_APP__SEATGEEK_API_BASEURL}/performers?q=${encodedArtistName}&client_id=${process.env.REACT_APP_SEATGEEK_API_SECRET}`);
    const artistResp = await response.json();

    if (!response.ok || !artistResp.performers || artistResp.performers.length === 0) {
        throw new Error('Artist Could Not Be Found');
    }

    const artistId = artistResp.performers[0].id;
    
    // Fetch the events for the artist
    const eventResponse = await fetch(`${process.env.REACT_APP__SEATGEEK_API_BASEURL}/events?performers.id=${artistId}&client_id=${process.env.REACT_APP_SEATGEEK_API_SECRET}`);
    const eventsData = await eventResponse.json();

    if (!eventResponse.ok || !eventsData.events || eventsData.events.length === 0) {
        throw new Error('No events were found for the artist');
    }

    eventsData.events.forEach((item) => {
        data.push({
            startDateTime: item['datetime_utc'],
            venue: item.venue
        });
    });

    artistData = artistResp.performers[0];

    return data;
}

export function GetArtistDetails() {
    return {
        artistName: artistData.name,
        profilePic: artistData.image
    };
}
