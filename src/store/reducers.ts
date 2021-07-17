import { ContactInterface } from "../contacts";
import { combineReducers, createStore } from "redux";

interface ActionInterface {
    type: string;
    data?: ContactInterface;
    id?: string;
}

interface StateInterface {
    contactList: ContactInterface[];
}

const initState : StateInterface = {
    contactList: []
}

function appReducer(state = initState, action: ActionInterface){
    const { data } = action; 
    const { type } = action;
    
    switch(type) {
        case "add":
            if (data){
                return {
                    ...state,
                    contactList: [...state.contactList, data]
                }
            }

            return state;
        
        case "remove":
            const { id } = action;
            const { contactList } = state;
            if (id){
                let i;
                for(i = 0; i <= contactList.length - 1; i++){
                    if (contactList[i].ID === id){
                        contactList.splice(i, 1);
                        return {
                            ...state
                        }
                    }
                }
            }

            return state;
        default:
            return state;
    }

}

const reducers = combineReducers({appReducer});
const store = createStore(reducers);
export default store;