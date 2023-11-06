import {REACT_APP_BACKEND_BASE_URL} from '@env'
import environment from '../../environment'
let data = [];
    export default async function GetMerchByArtistNameImpl(artistName) {
      data = [];
      console.log(`fetching ${environment.backendBaseUrl}/topic/${artistName}`)
        const response = await fetch(`${environment.backendBaseUrl}/topic/${artistName}`)
        if (!response.ok) {
          const text = await response.text();  // Try to get error text from the response
          throw new Error(`Data could not be fetched! URL: ${url}, Status: ${response.status}, Status Text: ${response.statusText}, Response Text: ${text}`);
        } else {
          const resp = await response.json();
          console.log(resp)
          if(resp !== undefined){
          resp.map((item)=>{
            data.push({
                name: item.name,
                image:item.image,
                url:item.link,
                price: item.price
            })
          })
          return data;
        }

        }
    }
