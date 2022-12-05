import { useState } from "react";
import GetMerchByArtistName, { GetEventsByArtistName } from "../../domain/ArtistRepository/ArtistRepository";

export default function MerchViewModel(){

    const [merch,setMerch] = useState([])

    async function getMerchByArtistName(artistName){
        const data = await GetMerchByArtistName(artistName);
        setMerch(data);
    }
    return{
        merch,
        getMerchByArtistName
    }
}