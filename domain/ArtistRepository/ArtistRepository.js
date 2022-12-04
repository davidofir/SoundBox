import GetEventsByArtistNameImpl from "../EventsAPI/EventsRepositoryImpl";
import GetMerchByArtistNameImpl from "../MerchAPI/MerchRepositoryImpl";
export async function GetEventsByArtistName(artistName,time){
    const data = await GetEventsByArtistNameImpl(artistName,time);
    return data;
}
export default async function GetMerchByArtistName(artistName){
    const data = await GetMerchByArtistNameImpl(artistName);
    return data;
}