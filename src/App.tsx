import { useEffect } from "react";
import Amplify, { API, Auth } from "aws-amplify";
import { withAuthenticator } from '@aws-amplify/ui-react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import config from "./config";
import { ContactInterface } from "./contacts";
import ContactBook from "./containers/contact";

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

function App () {
  const dispatch = useDispatch();

  function generateContact(){
    
    const generatedData: ContactInterface = {
      ID: uuidv4().toString(),
      Name: 'Edit',
      Digits: 'Edit',
      Status: 'Not Saved'
    }

    return generatedData;
  }

  function updateList(item: ContactInterface){
    return dispatch({type: "add", data: item })
  }

  useEffect(() => {
    // fetch authenticated user contact list
    async function fetchList(){
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
            // add contact stuatus to each;
            dispatch({type: "add", data: Items[i]})
          }
        })
        .catch(error => {console.log(error)});
    }

    fetchList();
  }, [dispatch]);

 
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
            
            <ContactBook />
        </div>
        <button className="add" onClick={() => updateList(generateContact())} >+</button>       
      </div>
    </div>
  );
}


export default withAuthenticator(App);
