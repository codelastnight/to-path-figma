<script lang="ts">
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import pathIcon from "./components/icons/path.svg";
  import pathEmptyIcon from "./components/icons/path-empty.svg";
  import shapeIcon from "./components/icons/shape.svg";
  import shapeEmptyIcon from "./components/icons/shape-empty.svg";

  import Tailwind from "./Tailwind.svelte";
  //import some Svelte Figma UI components
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import Select from "./components/Select.svelte";

  //menu items, this is an array of objects to populate to our select menus
  let menuItems = [
    { value: "rectangle", label: "Rectangle", group: null, selected: false },
    { value: "triangle", label: "Triangle ", group: null, selected: false },
    { value: "circle", label: "Circle", group: null, selected: false },
  ];
  window.oncontextmenu = null;

  var disabled = true;
  var count = 5;
  const version = "v2.0.0";

  let shapeState = "inactive";
  let pathState = "inactive";
  let selected: "path" | "shape" = "path";

  $ if (shapeState === "active")

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }
</script>

<Tailwind />
<div class="flex flex-col h-full justify-between">
  <main class="">
    <header class="px-xxs">
      <Label>Object</Label>
      <Select
        bind:state={shapeState}
        type="Shape or Text"
        icons={[shapeEmptyIcon, shapeIcon]}
      />
      <Label>Path</Label>
      <Select
        bind:state={pathState}
        type="Vector Path"
        icons={[pathEmptyIcon, pathIcon]}
      />
    </header>

    <Label>Count</Label>
  </main>
  <footer>
    <div class="p-xxs flex justify-between">
      <Button on:click={cancel} variant="secondary" class="mr-xsmall">
        Cancel
      </Button>
      <Button bind:disabled>Create shapes</Button>
    </div>
    <div class="footer-info">
      <p class="">{version}</p>
      <p class="">
        enjoy this plugin?
        <a href="/" target="_blank" class="underline">
          buy me a coffee {"<3"}
        </a>
      </p>
    </div>
  </footer>
</div>

<style lang="postcss">
  /* Add additional global or scoped styles here */
  .footer-info {
    @apply flex justify-between;
    @apply px-xxs py-xxxs;
    @apply text-[9px] text-[var(--figma-color-secondary)];
    @apply bg-[var(--figma-color-bg-secondary)];
    @apply border-t border-[var(--figma-color-border)];
  }
</style>
