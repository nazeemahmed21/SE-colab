import { createContext,useContext, useEffect, useState, useReducer} from "react";
import { AuthContext } from "./AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const [userIdNameMap, setuserIdNameMap] = useState({});


    useEffect(async () => {
      await getDocs(collection(db, "Users"))
      .then((userDocs) => {
          const idNameMap = {};
          userDocs.forEach((doc) => {
            const data = doc.data();
            const name = `${data.firstName} ${data.lastName}`;
            idNameMap[data.uid] = name;
          });
          setuserIdNameMap(idNameMap);
      });
    }, []);

    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    };

    // console.log("biggyat123", currentUser.uid)

    const chatReducer = (state, action) => {
        switch (action.type) {
          case "CHANGE_USER":
            return {
              user: action.payload.user,
              chatId: action.payload.chatId,
            };
    
          default:
            return state;
        }
      };
    


    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, userIdNameMap, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};