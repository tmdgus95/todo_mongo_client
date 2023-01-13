import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";
// redux-toolkit 적용
import store from "./reducer/store";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// store 를 Provider 를 이용해서 울타리친다.
// store 를 사용할 child 들을 설정한다.
import { Provider } from "react-redux";

export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Provider 는 필수 props 가 있다 : store={store}
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>

);
