import "./App.css";
import { useContext } from "react";

import { AuthView } from "../components/Auth/View";
import { DriverView } from "../components/DriverView/View";
import { UserView } from "../components/UserView/View";
import { AuthContext } from "./authContext";

function App() {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { user } = authData;
  if (user === null) {
    return <AuthView />;
  }
  if (user.driver) {
    return <DriverView />;
  }
  return <UserView />;
}

export default App;
