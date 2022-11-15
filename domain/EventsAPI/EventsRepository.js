import {REACT_APP_EVENTS_API_SECRET} from '@env'

const eventsURL = 'https://rest.bandsintown.com/artists'

const data = [];

export default class EventsRepository {
  
    GetEventsByArtistName = async(artistName,time)=> {
        const response = await fetch(`${eventsURL}/${artistName}/events?app_id=${process.env.REACT_APP_EVENTS_API_SECRET}&date=${time}`)
        if (!response.ok) {
          throw new Error('Data coud not be fetched!')
        } else {
          const resp = await response.json();
          resp.map((item)=>{
              data.push({
                  startDateTime: item[Object.keys(item)[2]],
                  venue:item.venue
                })
          })
          return data;
        }
    }
}
