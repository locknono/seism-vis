import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import figReducer from "./reducer/figReducer";
import globalVarReducer from "./reducer/globalVarReducer";
import wellReducer from "./reducer/wellReducer";
import storageReducer from "./reducer/storageReducer";
import controlReducer from "./reducer/controlReducer";

const rootReducer = combineReducers({
  figReducer,
  wellReducer,
  globalVarReducer,
  storageReducer,
  controlReducer
});

let store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
