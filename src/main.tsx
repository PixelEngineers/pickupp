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
import { createTheme, MantineColorsTuple } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const myColor: MantineColorsTuple = [
  "#effaeb",
  "#e2f1dc",
  "#c4e0ba",
  "#a4cf95",
  "#89c076",
  "#78b762",
  "#6eb357",
  "#5d9d46",
  "#508b3c",
  "#427930",
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Main />
      <Notifications
        zIndex={1000}
        style={{
          position: "absolute",
        }}
      />
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
