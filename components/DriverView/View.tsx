import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../src/authContext";
import { Logout } from "../Logout";
import { collection, onSnapshot } from "firebase/firestore";
import { Booking } from "../../src/models";

export function DriverView() {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { user, db } = authData;
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bookings"), (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        if (data.expiryTimestamp < Date.now()) {
          return;
        }
        setBookings((prev) => [...prev, data]);
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div>
      Driver {user?.name}
      <div style={{}}>
        {bookings.map((booking, index) => (
          <div key={index}>
            {booking.requester.name} wants to be picked at station{" "}
            {booking.station}
          </div>
        ))}
      </div>
      <Logout />
    </div>
  );
}
