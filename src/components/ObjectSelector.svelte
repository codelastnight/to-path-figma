<script lang="ts">
  import pathIcon from "./icons/path.svg";
  import pathEmptyIcon from "./icons/path-empty.svg";
  import shapeIcon from "./icons/shape.svg";
  import shapeEmptyIcon from "./icons/shape-empty.svg";
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import Select from "./Select.svelte";
  import { createEventDispatcher } from "svelte";
  import { postMessage } from "./util";
  //const dispatch = createEventDispatcher();
  // this code is um... dont look!!!

  let state = {
    shape: "active",
    path: "inactive",
    none: "",
  };
  let names = {
    shape: "",
    path: "",
    none: "",
  };
  let selectionMode = "shape";

  $: onStateSet(names);
  const reverse = {
    path: "shape",
    shape: "path",
    none: "none",
  };
  function onStateSet(currentState) {
    if (currentState.shape !== "" && currentState.path !== "") {
      selectionMode = "none";
      postMessage("selection:generate", { selectionMode: selectionMode });
    }
  }

  onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (msg.type === "selection:set-active") {
      console.log("ui:", msg);
      selectionMode = msg.selectionMode;
      if (selectionMode !== "none") {
        if ("name" in msg && !!msg.name) {
          names[msg.selectionMode] = msg.name;
          state[msg.selectionMode] = "set";
          if (state[reverse[msg.selectionMode]] !== "set")
            SetActive(reverse[msg.selectionMode]);
        }
      }
    }
  };

  function SetActive(selectId: "path" | "shape" | "none") {
    if (selectId === "none") return;
    selectionMode = selectId;
    state[selectId] = "active";
    const otherState = reverse[selectId];
    if (state[otherState] === "active") {
      state[otherState] = "inactive";
    }
    postMessage("selection:set-active", { selectionMode: selectionMode });
  }

  function clear(mode) {
    postMessage("selection:clear-active", { selectionMode: mode });
    SetActive(mode);
  }
</script>

<Label>Object</Label>
<Select
  state={state.shape}
  type="Shape or Text"
  icons={[shapeEmptyIcon, shapeIcon]}
  on:active={() => SetActive("shape")}
  bind:objectName={names.shape}
  on:clear={() => clear("shape")}
/>
<Label>Path</Label>
<Select
  state={state.path}
  type="Vector Path"
  icons={[pathEmptyIcon, pathIcon]}
  on:active={() => SetActive("path")}
  bind:objectName={names.path}
  on:clear={() => clear("path")}
/>
