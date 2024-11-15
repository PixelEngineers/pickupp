import { Button } from "@mantine/core";
import React, { useContext } from "react";
import { AuthContext } from "../src/authContext";

export function Logout() {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { auth, setUser } = authData;
  return (
    <Button
      variant="gradient"
      gradient={{ from: "red", to: "orange" }}
      style={{
        position: "absolute",
        top: "3vw",
        left: "3vw",
      }}
      onClick={() => {
        auth.signOut();
        setUser(null);
      }}>
      Logout
    </Button>
  );
}
