import { useState, useEffect } from "react";
import Amplify, { API, Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { v4 as uuidv4 } from 'uuid';
import Contact from "./components/contact.component";
import { useSelector, useDispatch } from 'react-redux';
import config from "./config";
import { ContactInterface } from "./contacts";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    userPoolId: config.cognito.USER_POOL_ID,
    region: config.cognito.REGION,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "contactStorageAPI",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

function ContactList(){
  const contacts = useSelector(state => state.appReducer);
  return (
    <>
      {contacts.contactList.length ? contacts.contactList.map(item => {
        return <Contact key={item.ID} information={item} />
      }) : null}
    </>
  )
}

function App () {
  const dispatch = useDispatch();
  function generateContact(){
    
    const generatedData: ContactInterface = {
      ID: uuidv4().toString(),
      Name: 'Null',
      Digits: 'Null',
      Status: 'Not Saved'
    }

    return generatedData;
  }

  class DispatchAPI {
      static updateList(item: any){
        return dispatch({type: "add", data: item })
      }
  }

  class ContactAPI {
      static async fetchList(){
        const apiName = 'contactStorageAPI';
        const path = '/list'; 
        const myInit = { 
              headers: { 
                Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
              }
            }
    
        API.get(apiName, path, myInit)
          .then(response => {
            const parsedResponse = JSON.parse(response.body);
            const { Items } = parsedResponse.result;
            let i;
            
            for (i = 0; i <= Items.length; i++){
              DispatchAPI.updateList(Items[i]);
            }
          })
          .catch(error => {console.log(error)});
      }

    static async createItem(putParams: any){
        const apiName = 'contactStorageAPI';
        const path = '/create'; 

        const myInit = { 
          headers: { 
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          },
          body: JSON.stringify(putParams)
        };

        API.post(apiName, path, myInit)
        .then(response => {console.log(response)})
        .catch(error => {console.log(error)});
    }
  }

  useEffect(() => {
    // fetch authenticated user contact list
    ContactAPI.fetchList();
  }, []);

 
  return (
    <div className="container">
      <div className="main">
        <div className="navigation">
            <div className="logo"><p className="logoText">Contact <span>Storage</span></p></div>
          </div>
        <div className="content">
            <div className="table">
              <p className="tableContactName">Name</p>
              <p className="tableContactNumber">Digits</p>
        </div>
          <ContactList />
        </div>
        <button className="add" onClick={() => DispatchAPI.updateList(generateContact())} >+</button>       
      </div>
    </div>
  );
}


export default withAuthenticator(App);
