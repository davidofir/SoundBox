import EventsRepositoryImpl from "./EventsRepositoryImpl";

const eventsRepo = EventsRepositoryImpl

export default class EventsRepository{
    async GetEventsByArtistName(artistName,time){

        const data = await eventsRepo.GetEventsByArtistName(artistName,time);
        return data;
    }
}