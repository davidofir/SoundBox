import { REACT_APP_SEATGEEK_API_SECRET, REACT_APP_TICKETMASTER_API_SECRET } from '@env';

const seatgeekBaseURL = 'https://api.seatgeek.com/2';
const ticketmasterBaseURL = 'https://app.ticketmaster.com/discovery/v2';  // This is an example, check the actual endpoint.

let artistData = {};
let data = [];

export default async function GetEventsByArtistNameImpl(artistName, time) {
    data = [];

    // URL encode the artist's name
    const encodedArtistName = encodeURIComponent(artistName);
    
    // Fetch the artist details from SeatGeek
    const artistResponse = await fetch(`${seatgeekBaseURL}/performers?q=${encodedArtistName}&client_id=${REACT_APP_SEATGEEK_API_SECRET}`);
    const artistResp = await artistResponse.json();

    if (!artistResponse.ok || !artistResp.performers || artistResp.performers.length === 0) {
        throw new Error('Artist Could Not Be Found');
    }
    artistData = artistResp.performers[0];

    // Fetch the events for the artist from Ticketmaster
    const eventResponse = await fetch(`${ticketmasterBaseURL}/events.json?keyword=${encodedArtistName}&apikey=${REACT_APP_TICKETMASTER_API_SECRET}`);
    const eventsData = await eventResponse.json();

    if (!eventResponse.ok || !eventsData._embedded || !eventsData._embedded.events || eventsData._embedded.events.length === 0) {
        throw new Error('No events were found for the artist');
    }
    const sortedEvents = eventsData._embedded.events.sort((a, b) => {
        return new Date(a.dates.start.dateTime) - new Date(b.dates.start.dateTime);
    });

    // Assuming each event has a name, date, and venue. Modify according to the actual structure.
    sortedEvents.forEach((item) => {
        // Check if the item has the required nested objects
        const dateTime = item.dates?.start?.dateTime;
        const venueDetails = item._embedded?.venues?.[0];
    
        if (dateTime && venueDetails) {
            data.push({
                startDateTime: dateTime,
                venue: {
                    name: venueDetails.name,
                    city: venueDetails.city?.name,
                    country: venueDetails.country?.name
                }
            });
        }
    });

    return data;
}

export function GetArtistDetails() {
    return {
        artistName: artistData.name,
        profilePic: artistData.image
    };
}
