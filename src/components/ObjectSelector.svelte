<script lang="ts">
  import pathIcon from "./icons/path.svg";
  import pathEmptyIcon from "./icons/path-empty.svg";
  import shapeIcon from "./icons/shape.svg";
  import shapeEmptyIcon from "./icons/shape-empty.svg";
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import Select from "./Select.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const select = () => dispatch(selected);

  let shapeState = "inactive";
  let pathState = "inactive";
  let selected: "path" | "shape" | "none" = "path";

  function isSet(a, b) {
    if (shapeState !== "set") shapeState = a;
    if (pathState !== "set") pathState = b;
  }

  function onActiveSet(selectId: "path" | "shape" | "none") {
    selected = selectId;
    switch (selectId) {
      case "path":
        isSet("inactive", "active");
        break;
      case "shape":
        isSet("active", "inactive");
        break;
      default:
        isSet("inactive", "inactive");
    }
  }
</script>

<Label>Object</Label>
<Select
  bind:state={shapeState}
  type="Shape or Text"
  icons={[shapeEmptyIcon, shapeIcon]}
  on:active={() => onActiveSet("shape")}
/>
<Label>Path</Label>
<Select
  bind:state={pathState}
  type="Vector Path"
  icons={[pathEmptyIcon, pathIcon]}
  on:active={() => onActiveSet("path")}
/>
