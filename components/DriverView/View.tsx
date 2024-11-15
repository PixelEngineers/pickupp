import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../src/authContext";
import { Logout } from "../Logout";
import { collection, onSnapshot } from "firebase/firestore";
import { Booking } from "../../src/models";
import background from "../../public/bg.jpg";
import { ToggleTheme } from "../ToggleTheme";
import { ScrollArea } from "@mantine/core";

export function DriverView() {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { db } = authData;
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      let output: Booking[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        if (data.expiryTimestamp < Date.now()) {
          return;
        }
        output.push(data);
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
        {bookings.map(({ requester: { name }, station }) => (
          <div
            style={{
              backgroundColor: "#a4cf95",
              padding: "2vw",
              marginBottom: "1vw",
              textAlign: "center",
              color: "black",
              fontSize: "5vw",
              borderRadius: "3vw",
            }}>
            <span>{name}</span> at <span>{station}</span>
          </div>
        ))}
      </ScrollArea>
      <ToggleTheme />
      <Logout />
    </div>
  );
}
