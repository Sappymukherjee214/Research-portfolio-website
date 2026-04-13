"use client";

import React from "react";
import MagneticCursor from "./MagneticCursor";
import TerminalOverlay from "./TerminalOverlay";
import SoundControl from "./SoundControl";

interface ClientRegistryProps {
  children: React.ReactNode;
}

export default function ClientRegistry({ children }: ClientRegistryProps) {
  return (
    <React.Fragment>
      <SoundControl />
      <MagneticCursor />
      <TerminalOverlay />
      {children}
    </React.Fragment>
  );
}
