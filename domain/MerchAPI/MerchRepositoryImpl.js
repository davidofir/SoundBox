import {REACT_APP_BACKEND_BASE_URL} from '@env'
let data = [];
    export default async function GetMerchByArtistNameImpl(artistName) {
      data = [];
      console.log(`fetching ${REACT_APP_BACKEND_BASE_URL}/topic/${artistName}`)
        const response = await fetch(`${REACT_APP_BACKEND_BASE_URL}/topic/${artistName}`)
        if (!response.ok) {
          throw new Error('Data coud not be fetched!')
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
