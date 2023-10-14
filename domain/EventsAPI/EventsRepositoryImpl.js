import { REACT_APP_SEATGEEK_API_SECRET, REACT_APP_TICKETMASTER_API_SECRET,REACT_APP__SEATGEEK_API_BASEURL,REACT_APP_TICKETMASTER_API_BASE_URL } from '@env';

let artistData = {};
let data = [];

export default async function GetEventsByArtistNameImpl(artistName, time) {
    data = [];
    let artistFound = false;
  
    try {
      // URL encode the artist's name
      const encodedArtistName = encodeURIComponent(artistName);
  
      // Fetch the artist details from SeatGeek
      const artistResponse = await fetch(
        `${REACT_APP__SEATGEEK_API_BASEURL}/performers?q=${encodedArtistName}&client_id=${REACT_APP_SEATGEEK_API_SECRET}`
      );
      const artistResp = await artistResponse.json();
  
      if (
        artistResponse.ok &&
        artistResp.performers &&
        artistResp.performers.length > 0
      ) {
        artistData = artistResp.performers[0];
        artistFound = true;
      }
  
      // Fetch the events for the artist from Ticketmaster
      const eventResponse = await fetch(
        `${REACT_APP_TICKETMASTER_API_BASE_URL}/events.json?keyword=${encodedArtistName}&apikey=${REACT_APP_TICKETMASTER_API_SECRET}`
      );
      const eventsData = await eventResponse.json();
  
      if (
        eventResponse.ok &&
        eventsData._embedded &&
        eventsData._embedded.events &&
        eventsData._embedded.events.length > 0
      ) {
        if (!artistFound) {
          return {
            error: true,
            message: "Inconsistency detected: Artist not found on SeatGeek but events found on Ticketmaster.",
            userMessage: "An inconsistency was detected. Please try again or contact support.",
          };
        }
  
        const sortedEvents = eventsData._embedded.events.sort((a, b) => {
          return new Date(a.dates.start.dateTime) - new Date(b.dates.start.dateTime);
        });
  
        sortedEvents.forEach((item) => {
          // Extract data if available
          const dateTime = item.dates?.start?.dateTime;
          const venueDetails = item._embedded?.venues?.[0];
  
          if (dateTime && venueDetails) {
            data.push({
              startDateTime: dateTime,
              venue: {
                name: venueDetails.name,
                city: venueDetails.city?.name,
                country: venueDetails.country?.name,
              },
            });
          }
        });
        return data;
      } else {
        return {
          error: true,
          message: "No events were found for the artist on Ticketmaster.",
          userMessage: "No events found for this artist.",
        };
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      return {
        error: true,
        message: error.message,
        userMessage: "An unexpected error occurred. Please try again later.",
      };
    }
  }
  
  export function GetArtistDetails() {
    return {
      artistName: artistData.name,
      profilePic: artistData.image,
    };
  }