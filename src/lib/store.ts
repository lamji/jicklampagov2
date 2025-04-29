/** @format */
import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Task } from "@/types";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as Task[],
  },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.items.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
  },
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["counter", "tasks"], // Add tasks to whitelist
};

const rootReducer = combineReducers({
  counter: counterSlice.reducer,
  tasks: tasksSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          // Ignore these action types
          "tasks/addTask",
          "tasks/updateTask",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export const { increment, decrement } = counterSlice.actions;
export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
