import { API, Auth } from "aws-amplify";
import DeleteIcon from "./delete.component";
import { useEffect, useState } from "react";
import { ContactInterface } from "../contacts";
import { useSelector, useDispatch } from 'react-redux';
import { DefaultRootState } from '../store/defaultstate';
import './contact.component.css';

interface contactProps {
  information: ContactInterface;
}

function Contact(Props: contactProps) {
  const status = ['deleting', 'saving', 'saved', 'unsaved'];
  const [contactDigits, setContactDigits] = useState('');
  const [contactName, setContactName] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [disableInput, setDisableInput] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Props.information.Status) {
      setDisableInput(false);
    }
    setContactDigits(Props.information.Digits);
    setContactName(Props.information.Name);
  }, [Props.information.Digits, Props.information.Name, Props.information.Status]);

  class ComponentInputAPI {
    static handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      setContactName(e.target.value);
      return;
    }

    static handleDigitsChange(e: React.ChangeEvent<HTMLInputElement>) {
      setContactDigits(e.target.value);
      return;
    }
  }

  // delete a contact

  async function deleteItem() {
    const { ID } = Props.information;
    if (ID) {
      setStatusUpdate(status[0]);
      const apiName = 'contactStorageAPI';
      const path = `/delete/${ID}`;

      const myInit = {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        }
      };

      API
        .del(apiName, path, myInit)
        .then(response => {
          const parsedResponse = JSON.parse(response.body);
          const { message } = parsedResponse;
          if (message === 'Success') {
            dispatch({ type: 'remove', id: ID });
            setStatusUpdate('');
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }

  // create a contact

  async function createItem() {

    const putParams = {
      id: Props.information.ID,
      digits: contactDigits,
      name: contactName
    }

    const apiName = 'contactStorageAPI';
    const path = '/create';

    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
      },
      body: JSON.stringify(putParams)
    };

    API.post(apiName, path, myInit)
      .then(response => {
        const parsedResponse = JSON.parse(response.body);
        const { message } = parsedResponse;

        if (message === 'Success') {
          setStatusUpdate(status[2]);
          setDisableInput(true);

          setTimeout(() => {
            setStatusUpdate('');
          }, 2000)
        }
      })
      .catch(error => { console.log(error) });
  }


  class ComponentBackendAPI {
    static async updateInformation() {
      if (contactDigits.length === 10 && contactName.length > 3) {
        setStatusUpdate(status[1]);
        try {
          return createItem();
        } catch (error) {
          throw new Error(error);
        }
      }
      return;
    }
  }

  return (
    <div className="contact">
      <div className="inputContainerName">
        <input type="text" disabled={disableInput} placeholder={contactName} onChange={(e) => ComponentInputAPI.handleNameChange(e)} />
      </div>

      <div className="inputContainer">
        <input type="text" disabled={disableInput} maxLength={10} placeholder={contactDigits} onChange={(e) => ComponentInputAPI.handleDigitsChange(e)} onBlur={() => ComponentBackendAPI.updateInformation()} />
      </div>

      <div className="progress">
        <p>{statusUpdate}...</p>
      </div>
      <div className="iconContainer" onClick={() => deleteItem()}>
        <DeleteIcon />
      </div>
    </div>
  )
}

export function ContactList(){
  const contacts = useSelector((state: DefaultRootState) => state.appReducer);
  return (
    <>
      {contacts.contactList.length ? contacts.contactList.map(item => {
        return <Contact key={item.ID} information={item} />
      }) : null}
    </>
  )
}

export default ContactList;