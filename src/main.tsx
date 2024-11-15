import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { AuthContext } from "./authContext";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "./models";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <Main />
    </MantineProvider>
  </React.StrictMode>
);

function Main() {
  const [user, setUser] = useState<User | null>(null);
  onAuthStateChanged(auth, (user) => {
    const targetDocument = localStorage.getItem("targetDocument");
    if (!user || !targetDocument) {
      setUser(null);
      localStorage.removeItem("targetDocument");
      return;
    }
    getDoc(doc(db, "users", targetDocument)).then((snapshot) => {
      setUser(snapshot.data() as unknown as User);
    });
  });
  return (
    <AuthContext.Provider
      value={{
        auth,
        db,
        user,
        setUser,
      }}>
      <App />
    </AuthContext.Provider>
  );
}
