import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./slices/editorSlice";
import markdownReducer from "./slices/markdownSlice";

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    markdown: markdownReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
