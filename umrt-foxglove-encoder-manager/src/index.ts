// src/index.ts

import { ExtensionContext } from "@foxglove/extension"; // This import is correct for your template
import { initEncoderManagerPanel } from "./EncoderManagerPanel"; // Import your init function

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({
    name: "Encoder Manager Panel", // This is the name shown in Foxglove's Add Panel menu
    // id: "encoder-manager-panel",   // A unique ID for your panel
    initPanel: initEncoderManagerPanel, // Point to your initialization function
  });
}
