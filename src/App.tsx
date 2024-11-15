import reactLogo from "./assets/react.svg";
import "./App.css";
import { px, Text } from "@mantine/core";
import { AuthenticationForm } from "../components/Auth/Form";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../src/firebase";

function App() {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });
  return (
    <main className="container">
      <img className="logo" src="images.png" width={175} height={150}>
        
      
      </img>
      <h1>Welcome to Pickupp</h1>
      

     
      <AuthenticationForm auth={auth} db={db} />

      <Text size="lg">Made by PixelEngineers</Text>
    </main>
  );
}

export default App;
