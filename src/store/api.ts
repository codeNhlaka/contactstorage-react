import { API, Auth } from 'aws-amplify';

export interface ItemInfoInterface {
    id: string;
    name: string;
    digits: string;
}

export class ComponentServerSideAPI {
    readonly apiName: string;
    readonly path: string;

    constructor(apiName: string, path: string){
        this.apiName = apiName;
        this.path = path;
    }

    async createItemInDB(data: ItemInfoInterface){
        const requestInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
            },
            body: JSON.stringify(data) 
        }
        
        API.post(this.apiName, this.path, requestInit)
            .then(response => {
                const parsedResponse = JSON.parse(response.body);
                const { message } = parsedResponse;
            
                if (message === 'Success') {
                    return true;
                }
            })
            .catch(error => { console.log(error) });
        
        return false;
    }
    
    async deleteItemInDB(){
        const requestInit = {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
              }
        }

        API.del(this.apiName, this.path, requestInit)
            .then(response => {
                const parsedResponse = JSON.parse(response.body);
                const { message } = parsedResponse;

                if (message === 'Success'){
                    return true;
                }
            })
            .catch(error => {
                console.log(error);
            });

        return false;
    }
}   