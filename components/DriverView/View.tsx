import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../src/authContext";
import { Logout } from "../Logout";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Booking } from "../../src/models";
import background from "../../public/bg.jpg";
import { ToggleTheme } from "../ToggleTheme";
import { Button, ScrollArea } from "@mantine/core";
import { Check } from "iconoir-react";

export function DriverView() {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { db } = authData;
  const [bookings, setBookings] = useState<(Booking & { id: string })[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      let output: (Booking & { id: string })[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        if (data.expiryTimestamp < Date.now()) {
          return;
        }
        output.push({
          id: doc.id,
          ...data,
        });
      });
      setBookings(output);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "5vw",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}>
      <img src="/logo.svg" alt="logo" width={150} height={150} />
      <ScrollArea h={300}>
        {bookings.map(({ id, requester: { name }, station }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "80vw",
              backgroundColor: "#a4cf95",
              padding: "2vw",
              marginBottom: "1vw",
              textAlign: "center",
              color: "black",
              fontSize: "5vw",
              borderRadius: "3vw",
              gap: "5vw",
            }}>
            <div>
              <span>{name}</span> at <span>{station}</span>
            </div>
            <Button
              onClick={() => {
                deleteDoc(doc(db, "bookings", id));
              }}
              variant="default">
              <Check />
            </Button>
          </div>
        ))}
      </ScrollArea>
      <ToggleTheme />
      <Logout />
    </div>
  );
}
