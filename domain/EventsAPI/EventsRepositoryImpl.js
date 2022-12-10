import {REACT_APP_EVENTS_API_SECRET} from '@env'

const eventsURL = 'https://rest.bandsintown.com/artists'
let artistData = {};
let data = [];
let found = false;
     export default async function GetEventsByArtistNameImpl(artistName,time) {
      data = [];

        const response = await fetch(`${eventsURL}/${artistName}/events?app_id=${process.env.REACT_APP_EVENTS_API_SECRET}&date=${time}`)
        if (!response.ok) {
          throw new Error('Data coud not be fetched!')
        } else {
          const resp = await response.json();
          if(resp.length !== 0){
          resp.map((item)=>{
              data.push({
                  startDateTime: item[Object.keys(item)[2]],
                  venue:item.venue
                })
          })
          artistData = resp[0].artist;
        }
        return data;
      }
    }
    export function GetArtistDetails(){
      return {
        artistName: artistData.name,
        profilePic: artistData['thumb_url']
      };
    }

