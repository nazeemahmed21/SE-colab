import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore'
import { db } from "../firebase";
import { getAuth } from 'firebase/auth';

const database = db;

let ids = []
let events = []
let todos = [];
let itemids = []
let ritemids = []

const fetchid = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userid = currentUser.uid;
    const colRef = collection(database, 'Users')

    const q = query(colRef, where("uid", "==", userid))

    onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        ids.push({ ...doc.data(), id: doc.id });
      });
      console.log(ids[0].id);
      populateritemids();
      fetchdata();
    });
  } catch (error) {
    console.log("message:", error);
  }
};

const populateritemids = () => {
  const colRef5 = collection(database, 'Users', ids[0].id, 'reminder')
  let pop = []

  onSnapshot(colRef5, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      pop.push({ ...doc.data(), id: doc.id });
    });

    for (const p of pop) {
      ritemids.push(p.itemid)
    }
  })
  console.log(ritemids)
}

const fetchdata = async () => {
  try {
    const colRef2 = collection(database, 'CalendarEvents');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const path = ids[0].id;

    const userDocRef = doc(db, "Users", path);
    const todosCollection = collection(userDocRef, "todo");
    if (todosCollection) {
      const querySnapshot = await getDocs(todosCollection);
      console.log("Query snapshot:", querySnapshot);
      todos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    console.log(todos);
    addtodos()

    const q2 = await query(colRef2, where("uid", "==", ids[0].id), where("Start Date", ">=", today), where("Start Date", "<", new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)))

    onSnapshot(q2, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        events.push({ ...doc.data(), id: doc.id });
      });
      console.log(events);
      addevents()
    });
  } catch (error) {
    console.log("message:", error);
  }
};

const addevents = async () => {
  try {
    for (const event of events) {
      itemids.push(event.id);
      const res = await addDoc(collection(database, 'Users', ids[0].id, 'reminder'), {
        title: event.Title,
        status: 'unread',
        itemid: event.id
      });
      const res2 = await updateDoc(doc(collection(database, 'Users', ids[0].id, 'reminder'), res.id), {
        id: res.id
      });
    };
    fetchreminders();
  } catch (error) {
    console.log("message:", error);
  }
};

const addtodos = async () => {
  try {
    for (const todo of todos) {
      itemids.push(todo.id);
      const res = await addDoc(collection(database, 'Users', ids[0].id, 'reminder'), {
        title: todo.title,
        status: 'unread',
        itemid: todo.id
      });
      const res2 = await updateDoc(doc(collection(database, 'Users', ids[0].id, 'reminder'), res.id), {
        id: res.id
      });
    };
  } catch (error) {
    console.log("message:", error);
  }
};

let reminders = []

const fetchreminders = async () => {
  try {
    for (const id of itemids) {
      if (!(id in ritemids)) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const colRef4 = collection(database, 'Users', ids[0].id, 'reminder');

        const q4 = query(colRef4, where("status", "==", "unread"), where("itemid", "==", id))

        const snapshot = await getDocs(q4);

        snapshot.docs.forEach((doc) => { reminders.push({ ...doc.data(), id: doc.id }); });
        console.log(reminders);

        ritemids.push(id);
      }
    }
  } catch (error) {
    console.log("message:", error);
  }
};

const updateReminder = async (id) => {
  try {
    const res = await updateDoc(doc(collection(database, 'Users', ids[0].id, 'reminder'), id), {
      status: 'read'
    });
  } catch (error) {
    console.log("message: ", error)
  }
}

export { fetchid, reminders, updateReminder }

