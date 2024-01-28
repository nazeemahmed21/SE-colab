import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { todosCollection } from "../firebase";

const initialValue = {
  filterStatus: "all",
  todoList: [],
};

const fetchTodosAsync = createAsyncThunk("todo/fetchTodos", async () => {
  try {
    const querySnapshot = await getDocs(todosCollection);
    const todos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
});

const addTodoAsync = createAsyncThunk(
  "todo/addTodo",
  async (todo, thunkAPI) => {
    try {
      const newTodo = {
        ...todo,
        time: todo.time.toLocaleString(),
      };
      const docRef = await addDoc(todosCollection, newTodo);
      return { id: docRef.id, ...newTodo };
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  }
);

const updateTodoAsync = createAsyncThunk(
  "todo/updateTodo",
  async (updatedTodo, thunkAPI) => {
    try {
      console.log("Updating todo:", updatedTodo);
      const { id, ...updatedTodoData } = updatedTodo;
      console.log("Updated data:", updatedTodoData);
      const response = await updateDoc(
        doc(todosCollection, id),
        updatedTodoData
      );
      console.log("Update response:", response);

      return updatedTodo;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  }
);

const deleteTodoAsync = createAsyncThunk(
  "todo/deleteTodo",
  async (todoId, thunkAPI) => {
    try {
      await deleteDoc(doc(todosCollection, todoId));
      return todoId;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState: initialValue,
  reducers: {
    updateFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.todoList.push(action.payload);
      })
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const { id, ...updatedTodo } = action.payload;
        state.todoList = state.todoList.map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        );
      });
    builder.addCase(deleteTodoAsync.fulfilled, (state, action) => {
      const todoId = action.payload;
      state.todoList = state.todoList.filter((todo) => todo.id !== todoId);
    });
    builder.addCase(fetchTodosAsync.fulfilled, (state, action) => {
      state.todoList = action.payload;
    });
  },
});

export const { updateFilterStatus } = todoSlice.actions;
export { addTodoAsync, updateTodoAsync, deleteTodoAsync, fetchTodosAsync };
export default todoSlice.reducer;
