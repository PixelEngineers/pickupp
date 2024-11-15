import { useContext, useState } from "react";
import { AuthContext } from "../../src/authContext";
import { Logout } from "../Logout";
import { addDoc, collection } from "firebase/firestore";
import { Button, Select } from "@mantine/core";
import { Booking, Station, mapNames } from "../../src/models";
import { ToggleTheme } from "../ToggleTheme";
import { notifications } from "@mantine/notifications";
import background from "../../public/bg.jpg";

const MINUTES = 60 * 1000;
const TTL = 2 * MINUTES;
export function UserView() {
  const authData = useContext(AuthContext);
  const [station, setStation] = useState<Station | null>();
  if (authData === null) {
    return;
  }
  const { user, db } = authData;
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "15vw",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}>
      <img src="/logo.svg" alt="logo" width={250} height={250} />
      <Select
        label="Which station do you want to be picked at?"
        placeholder="Select station"
        data={mapNames(Object.values(Station), Object.keys(Station))}
        searchable
        onChange={(label) => {
          setStation(label as Station);
        }}
      />
      <ToggleTheme />
      <Button
        variant="gradient"
        gradient={{ from: "teal", to: "cyan" }}
        onClick={() => {
          addDoc(collection(db, "bookings"), {
            requester: user,
            station,
            expiryTimestamp: Date.now() + TTL,
          } as Booking).then(() => {
            notifications.show({
              title: "Booking successful",
              message: "You will be picked up soon",
            });
          });
        }}>
        Book
      </Button>
      <Logout />
    </div>
  );
}
