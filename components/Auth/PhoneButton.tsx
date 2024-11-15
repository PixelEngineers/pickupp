import React from "react";
import { Button, ButtonProps } from "@mantine/core";
import { Phone } from "iconoir-react";

export function PhoneButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<"button">
) {
  return <Button leftSection={<Phone />} variant="default" {...props} />;
}
