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
      variant="default"
      onClick={() => {
        auth.signOut();
        setUser(null);
      }}>
      Logout
    </Button>
  );
}
