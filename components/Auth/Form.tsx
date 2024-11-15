import { useState, useEffect, useContext } from "react";
import { useToggle, upperFirst, useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Modal,
  PinInput,
  Flex,
} from "@mantine/core";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { GoogleButton } from "./GoogleButton";
import { PhoneButton } from "./PhoneButton";
import { User } from "../../src/models";
import { AuthContext } from "../../src/authContext";
import { notifications } from "@mantine/notifications";

const PASSWORD_MIN_LENGTH = 6;

export function AuthenticationForm(props: PaperProps) {
  const authData = useContext(AuthContext);
  if (authData === null) {
    return;
  }
  const { db, auth, setUser } = authData;
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [type, toggle] = useToggle(["login", "register"]);
  const [phoneCodeConfirmer, setPhoneCodeConfirmer] =
    useState<ConfirmationResult | null>(null);
  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "captcha", {
      size: "invisible",
      callback: () => {
        setCaptchaPassed(true);
      },
    });
  }, []);
  const [phone, setPhone] = useState("");
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < PASSWORD_MIN_LENGTH
          ? `Password should include at least ${PASSWORD_MIN_LENGTH} characters`
          : null,
    },
  });

  return (
    <Paper
      radius="md"
      p="xl"
      style={{
        width: "90vw",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "20vh",
      }}
      withBorder
      {...props}>
      <div id="captcha"></div>
      <Modal opened={opened} onClose={close} title="Phone Sign In">
        {phoneCodeConfirmer !== null ? (
          //   <PinInput type={/^[0-9]^/} inputType="tel" inputMode="numeric" />
          <PinInput
            onChange={(value) => {
              if (value.length !== 6) {
                return;
              }
              phoneCodeConfirmer
                .confirm(value)
                .then(({ user: { uid, displayName } }) => {
                  const q = query(
                    collection(db, "users"),
                    where("id", "==", uid)
                  );
                  let type = "login";
                  let data = {} as User;
                  getDocs(q).then((querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      type = "register";
                    }
                    data = querySnapshot.docs[0].data() as User;
                  });
                  if (type === "register") {
                    const data = {
                      id: uid,
                      name: displayName,
                      driver: false,
                    } as User;
                    addDoc(collection(db, "users"), data)
                      .then(({ id }) => {
                        localStorage.setItem("targetDocument", id);
                        setUser(data);
                        close();
                      })
                      .catch((e) => {
                        // failed to save user doc
                        notifications.show({
                          title: "Failed to save user data",
                          message: "Maybe try again later",
                          color: "red",
                        });
                        console.log(e);
                      });
                    setUser(data);
                    return;
                  }
                  setUser(data);
                  // signed in
                })
                .catch((e) => {
                  // invalid code
                  notifications.show({
                    title: "Invalid code",
                    message: "Please try again",
                    color: "red",
                  });
                  console.log(e);
                });
            }}
            oneTimeCode
          />
        ) : (
          <TextInput
            id="phone-signin"
            label="Phone Number"
            placeholder="+1234567890"
            radius="md"
            onChange={(event) => setPhone(event.currentTarget.value)}
          />
        )}
        <Button
          onClick={() => {
            if (!captchaPassed) {
              notifications.show({
                title: "Captcha Failed",
                message: "Please try again",
                color: "red",
              });
              // captcha failed
              return;
            }
            signInWithPhoneNumber(
              auth,
              phone,
              (window as any).recaptchaVerifier
            )
              .then((confirmationResult) => {
                setPhoneCodeConfirmer(confirmationResult);
              })
              .catch((e) => {
                // failed to login with phone
                notifications.show({
                  title: "Failed to login with phone",
                  message: "Please try again",
                  color: "red",
                });
                console.log(e);
              });
          }}
          radius="xl">
          Send Code
        </Button>
      </Modal>
      <Text size="lg" fw={500}>
        {upperFirst(type)}
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton
          onClick={() => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
              .then((result) => {
                const crediential =
                  GoogleAuthProvider.credentialFromResult(result);
                if (!crediential) {
                  return;
                }
                const { uid } = result.user;

                const q = query(
                  collection(db, "users"),
                  where("id", "==", uid)
                );
                getDocs(q)
                  .then((querySnapshot) => {
                    const { id } = querySnapshot.docs[0];
                    localStorage.setItem("targetDocument", id);
                    setUser(querySnapshot.docs[0].data() as User);
                  })
                  .catch((e) => {
                    // failed to fetch user doc
                    console.log(e);
                    notifications.show({
                      title: "Failed to fetch user data",
                      message: "Maybe try again later",
                      color: "red",
                    });
                  });
              })
              .catch((e) => {
                // failed to login with google
                console.log(e);
                notifications.show({
                  title: "Failed to login with google",
                  message: "Please try again",
                  color: "red",
                });
              });
          }}
          radius="xl">
          Google
        </GoogleButton>
        <PhoneButton onClick={open} radius="xl">
          Phone
        </PhoneButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        onSubmit={form.onSubmit(() => {
          const { email, name, password } = form.values;
          if (type === "register") {
            createUserWithEmailAndPassword(auth, email, password)
              .then(({ user: { uid } }) => {
                const data = {
                  id: uid,
                  name: name,
                  driver: false,
                } as User;
                addDoc(collection(db, "users"), data)
                  .then(({ id }) => {
                    localStorage.setItem("targetDocument", id);
                    setUser(data);
                  })
                  .catch((e) => {
                    // failed to save user doc
                    console.log(e);
                    notifications.show({
                      title: "Failed to save user data",
                      message: "Maybe try again later",
                      color: "red",
                    });
                  });
              })
              .catch((e) => {
                // failed to create user
                console.log(e);
                notifications.show({
                  title: "Failed to create user",
                  message: "Please try again",
                  color: "red",
                });
              });
            return;
          }
          signInWithEmailAndPassword(auth, email, password)
            .then(({ user: { uid } }) => {
              const q = query(collection(db, "users"), where("id", "==", uid));
              getDocs(q)
                .then((querySnapshot) => {
                  const { id } = querySnapshot.docs[0];
                  localStorage.setItem("targetDocument", id);
                  setUser(querySnapshot.docs[0].data() as User);
                })
                .catch((e) => {
                  // failed to fetch user doc
                  console.log(e);
                  notifications.show({
                    title: "Failed to fetch user data",
                    message: "Maybe try again later",
                    color: "red",
                  });
                });
            })
            .catch((e) => {
              // failed to login user
              console.log(e);
              notifications.show({
                title: "Failed to login user",
                message: "Please try again",
                color: "red",
              });
            });
        })}>
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={
              form.errors.password &&
              "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Flex direction="column" gap="lg" mt="xl">
          <Anchor type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Flex>
      </form>
    </Paper>
  );
}
