import React, { Suspense } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Store";
import { HelmetProvider } from "react-helmet-async";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import RootRouter from "./Routes/RouteRouter";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./Components/Layouts/Public/ErrorFallback/ErrorFallback";
// import { Loader } from "rsuite";

// const baseName = import.meta.env.VITE_BASE_NAME;

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="*" element={<RootRouter />} />)
  // { basename: baseName }
);

const App = () => {
  return (
    <>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            {/* <Loader /> */}
            <HelmetProvider>
              <ToastContainer limit={3} />
              <RouterProvider router={router} />
            </HelmetProvider>
          </PersistGate>
        </Provider>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default App;
