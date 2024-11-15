import { useContext, useState } from "react";
import { AuthContext } from "../../src/authContext";
import { Logout } from "../Logout";
import { addDoc, collection } from "firebase/firestore";
import { Button, Select } from "@mantine/core";
import { Booking, Station, mapNames } from "../../src/models";

const MINUTES = 60 * 1000;
export function UserView() {
  const authData = useContext(AuthContext);
  const [station, setStation] = useState<Station | null>();
  if (authData === null) {
    return;
  }
  const { user, db } = authData;
  return (
    <div>
      User {user?.name}
      <Select
        label="Which station do you want to be picked at?"
        placeholder="Select station"
        data={mapNames(Object.values(Station), Object.keys(Station))}
        searchable
        onChange={(label) => {
          let i = 0;
          for (let key in Object.keys(Station)) {
            if (key == label) {
              setStation(Object.values(Station)[i]);
            }
            i++;
          }
        }}
      />
      <Button
        onClick={() => {
          addDoc(collection(db, "bookings"), {
            requester: user,
            station,
            expiryTimestamp: Date.now() + 2 * MINUTES,
          } as Booking);
        }}>
        Book
      </Button>
      <Logout />
    </div>
  );
}
