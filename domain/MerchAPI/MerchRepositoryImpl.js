import {REACT_APP_STORE_API_URL} from '@env'
const data = [];
export default class {
    GetMerchByArtistName = async(artistName)=> {
        const response = await fetch(`${process.env.REACT_APP_STORE_API_URL}/${artistName}`)
        if (!response.ok) {
          throw new Error('Data coud not be fetched!')
        } else {
          const resp = await response.json();
          if(resp.Content !== undefined){
          resp.Content.map((item)=>{
            data.push({
                name: item.name,
                image:item.images["lg"],
                url:item.url
            })
          })
          return data;
        }else{
          return undefined
        }

        }
    }
}