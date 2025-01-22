import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query';

import Loader from './Loader';
import Nutrition from './Nutrition';
import Auth from './Auth';
import { userApi } from '../Services/Api/module/foodApi';


const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['common'],
};
const reducers = combineReducers({
     Loader,
     Nutrition,
     Auth,
  [userApi.reducerPath]:userApi.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(userApi.middleware);
    return middlewares;
  },
});

const persistor = persistStore(store);
setupListeners(store.dispatch);
// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };