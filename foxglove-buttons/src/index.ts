import { ExtensionContext } from "@foxglove/extension";

import { initExamplePanel } from "./ButtonsPanel";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "UMRT_Buttons", initPanel: initExamplePanel });
}
