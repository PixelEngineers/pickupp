import { AuthenticationForm } from "./Form";
import { Text } from "@mantine/core";

export function AuthView() {
  return (
    <main className="container">
      <img className="logo" src="images.png" width={175} height={150}></img>
      <h1>Welcome to Pickupp</h1>

      <AuthenticationForm />

      <Text size="lg">Made by PixelEngineers</Text>
    </main>
  );
}
