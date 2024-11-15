import { ToggleTheme } from "../ToggleTheme";
import { AuthenticationForm } from "./Form";
import { Text } from "@mantine/core";
import background from "../../public/bg.jpg";

export function AuthView() {
  return (
    <main
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="container">
      <img className="logo" src="images.png" width={175} height={150}></img>
      <ToggleTheme />
      <h1
        style={{
          color: "white",
        }}>
        Welcome to Pickupp
      </h1>

      <AuthenticationForm />

      <Text size="lg">Made by PixelEngineers</Text>
    </main>
  );
}
