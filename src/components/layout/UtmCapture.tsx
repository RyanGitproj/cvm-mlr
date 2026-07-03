"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

/** Monté une fois dans le layout racine : mémorise les UTM du premier touchpoint. */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
