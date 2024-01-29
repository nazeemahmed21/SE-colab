import firebase from "firebase/compat/app";
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { auth } from "../firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBJ0R15ggpAOPPNYXOIxJMeXzJxmwqx2Qc",
  authDomain: "final-colab.firebaseapp.com",
  projectId: "final-colab",
  storageBucket: "final-colab.appspot.com",
  messagingSenderId: "474778904282",
  appId: "1:474778904282:web:4e6913ee24a5b7f214a7e3",
}

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);

let ids = []
let events = []
let todos = []
let itemids = []
let ritemids = []

const fetchid = async () => {
  try {
    const currentUser = auth.currentUser;
    const userid = currentUser.uid;
    const colRef = collection(db, 'Users')

    const q = query(colRef, where("uid", "==", userid))

    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        ids.push({ ...doc.data(), id: doc.id });
      });
      console.log(ids);
      populateritemids()
      fetchdata();
    });
  } catch (error) {
    console.log("message:", error);
  }
};

const populateritemids = () => {
  const colRef5 = collection(db, 'Users', ids[0].id, 'reminder')
  let pop = []

  onSnapshot(colRef5, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      pop.push({ ...doc.data(), id: doc.id });
    });

    for (const p of pop) {
      ritemids.push(p.itemid)
    }
  })
}

const fetchdata = () => {
  try {
    const colRef2 = collection(db, 'Users', ids[0].id, 'calendar');

    const date = new Date();
    let curDate = date.toLocaleDateString('en-US');
    console.log(curDate)

    const q2 = query(colRef2, where("startDate", "==", curDate))

    onSnapshot(q2, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        events.push({ ...doc.data(), id: doc.id });
      });
      console.log(events);
      addevents()
    });

    const colRef3 = collection(db, 'Users', ids[0].id, 'todo');

    const q3 = query(colRef3, where("time", "==", curDate), where("status", "!=", "complete"))

    onSnapshot(q3, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        todos.push({ ...doc.data(), id: doc.id })
      })
      console.log(todos)
      addtodos()
    })
  } catch (error) {
    console.log("message:", error);
  }
};

const addevents = async () => {
  try {
    for (const event of events) {
      itemids.push(event.id);
      const res = await addDoc(collection(db, 'Users', ids[0].id, 'reminder'), {
        title: event.title,
        status: 'unread',
        itemid: event.id
      });
      const res2 = await updateDoc(doc(collection(db, 'Users', ids[0].id, 'reminder'), res.id), {
        id: res.id
      });
    };
  } catch (error) {
    console.log("message:", error);
  }
};

const addtodos = async () => {
  try {
    for (const todo of todos) {
      itemids.push(todo.id);
      const res = await addDoc(collection(db, 'Users', ids[0].id, 'reminder'), {
        title: todo.title,
        status: 'unread',
        itemid: todo.id
      });
      const res2 = await updateDoc(doc(collection(db, 'Users', ids[0].id, 'reminder'), res.id), {
        id: res.id
      });
    };
    fetchreminders();
  } catch (error) {
    console.log("message:", error);
  }
};

let reminders = []

const fetchreminders = async () => {
  // let reminders = []
  try {
    for (const id of itemids) {
      if (!(id in ritemids)) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const colRef4 = collection(db, 'Users', ids[0].id, 'reminder');

        const q4 = query(colRef4, where("status", "==", "unread"), where("itemid", "==", id))

        const snapshot = await getDocs(q4);

        snapshot.docs.forEach((doc) => { reminders.push({ ...doc.data(), id: doc.id }); });
        console.log(reminders);

        ritemids.push(id);
        // reminders.length = 0;
      }
    }
  } catch (error) {
    console.log("message:", error);
  }
  // return reminders;
};

const updateReminder = async (id) => {
  try {
    const res = await updateDoc(doc(collection(db, 'Users', ids[0].id, 'reminder'), id), {
      status: 'read'
    });
  } catch (error) {
    console.log("message: ", error)
  }
}

fetchid()

export { reminders, updateReminder }