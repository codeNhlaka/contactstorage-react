import { useSelector, useDispatch } from 'react-redux';
import { DefaultRootState } from '../store/defaultstate';
import { ComponentServerSideAPI } from '../store/api';
import ContactList from '../components/contact.component';
import { ItemInfoInterface } from '../store/api';

function ContactBook(){
    const dispatch = useDispatch();
    const contacts = useSelector((state: DefaultRootState) => state.appReducer);
    let apiName = 'contactStorageAPI';


    async function deleteItem(id: string, unsaved: boolean){
        if (unsaved){
            dispatch({type: 'remove', id});
            return;
        } else {
            const path = `/delete/${id}`;
            try {
                const api = new ComponentServerSideAPI(apiName, path);
                const resp = await api.deleteItemInDB();
                return dispatch({type: 'remove', id});
            } catch(error){
                console.log(error);
            }         
        }
    }


    function createItem(data: ItemInfoInterface) {

        const putParams = {
          id: data.id,
          digits: data.digits,
          name: data.name
        }
    
        try {
          const path = '/create';
          const api = new ComponentServerSideAPI(apiName, path);

          const resp = api.createItemInDB(putParams);
          return;

        } catch (error){
            console.log(error);
        }

        return;
    }


    return(
        <>
            <ContactList create={createItem} delete={deleteItem} contacts={contacts} />
        </>
    )
}

export default ContactBook;