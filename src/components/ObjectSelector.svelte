<script lang="ts">
  import pathIcon from "./icons/path.svg";
  import pathEmptyIcon from "./icons/path-empty.svg";
  import shapeIcon from "./icons/shape.svg";
  import shapeEmptyIcon from "./icons/shape-empty.svg";
  import textIcon from "./icons/text.svg";
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import Select from "./Select.svelte";
  import { postMessage } from "./util/message";
  //const dispatch = createEventDispatcher();
  // this code is um... dont look!!!

  type State = "active" | "inactive" | "set" | "";
  let state: { [key: string]: State } = {
    shape: "active",
    path: "inactive",
    none: "",
  };
  let names: { [key: string]: State } = {
    shape: "",
    path: "",
    none: "",
  };
  const reverse = {
    path: "shape",
    shape: "path",
    none: "none",
  };

  type Modes = "path" | "shape" | "text" | "none";
  let selectionMode: Modes = "shape";

  $: onStateSet(names);

  function onStateSet(currentState: typeof state) {
    if (currentState.shape === "" || currentState.path === "") return;
    selectionMode = "none";
    postMessage("selection:generate", { selectionMode: selectionMode });
  }
  function SetActive(selectId: Modes) {
    if (selectId === "none") return;
    selectionMode = selectId;
    state[selectId] = "active";
    const otherState = reverse[selectId];
    if (state[otherState] === "active") state[otherState] = "inactive";

    postMessage("selection:set-active", { selectionMode: selectionMode });
  }

  function clear(mode: Modes) {
    postMessage("selection:clear-active", { selectionMode: mode });
    SetActive(mode);
  }

  export const onSelection = (msg) => {
    if (msg.type === "selection:set-active") {
      selectionMode = msg.selectionMode;
      if (selectionMode === "none") return;

      if ("name" in msg && !!msg.name) {
        names[msg.selectionMode] = msg.name;
        state[msg.selectionMode] = "set";
        if (state[reverse[msg.selectionMode]] !== "set")
          SetActive(reverse[msg.selectionMode]);
      }
    }
  };
</script>

<Label>Object or Text</Label>
<Select
  state={state.shape}
  type="Shape or Text"
  icons={[shapeEmptyIcon, shapeIcon]}
  on:active={() => SetActive("shape")}
  bind:objectName={names.shape}
  on:clear={() => clear("shape")}
/>
<div class="flex justify-between">
  <Label>Path</Label>
  <button>swap</button>
</div>
<Select
  state={state.path}
  type="Vector Path"
  icons={[pathEmptyIcon, pathIcon, textIcon]}
  altIcon={selectionMode === "text"}
  on:active={() => SetActive("path")}
  bind:objectName={names.path}
  on:clear={() => clear("path")}
/>
