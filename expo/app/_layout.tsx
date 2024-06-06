// Init dayjs plugins
import "@/utils/dayjs";

import { Providers } from "@/modules/Providers";
import { Slot } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
