import { ContactInterface } from "../contacts";

export interface DefaultRootState {
    appReducer: {
      contactList: ContactInterface[]
    }
  }