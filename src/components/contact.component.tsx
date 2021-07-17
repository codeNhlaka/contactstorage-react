import DeleteIcon from "./delete.component";
import { useEffect, useState } from "react";
import { ContactInterface } from "../contacts";
import { DefaultRootState } from '../store/defaultstate';
import './contact.component.css';

interface ItemInfoInterface {
  id: string;
  name: string;
  digits: string;
}

interface GlobalComponentProps {
  create: (data: ItemInfoInterface) => void;
  delete: (id: string, unsaved: boolean) => void;
}

interface ComponentProps extends GlobalComponentProps{
  contacts: DefaultRootState['appReducer'];
}

interface contactProps extends GlobalComponentProps{
  information: ContactInterface;
}

function Contact(Props: contactProps) {
  const [contactDigits, setContactDigits] = useState('');
  const [contactName, setContactName] = useState('');
  const [disableInput, setDisableInput] = useState(true);

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

  async function deleteItem() {
    const { ID } = Props.information;
    const unsavedContact: boolean = (contactName === 'Edit' && contactDigits === 'Edit');
    return Props.delete(ID, unsavedContact);
  } 

  class ComponentBackendAPI {
    static async updateInformation() {
      if (contactDigits.length === 10 && contactName.length > 3) {
        try {
          Props.create({
            id: Props.information.ID,
            name: contactName,
            digits: contactDigits
          });
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
        <p>...</p>
      </div>
      <div className="iconContainer" onClick={() => deleteItem()}>
        <DeleteIcon />
      </div>
    </div>
  )
}

export function ContactList(Props: ComponentProps){
  const list = Props.contacts.contactList;

  return (
    <>
      {list.length ? list.map(item => {
        return <Contact create={Props.create} delete={Props.delete} key={item.ID} information={item} />
      }) : null}
    </>
  )
}

export default ContactList;