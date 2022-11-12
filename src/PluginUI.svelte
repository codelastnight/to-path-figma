<script lang="ts">
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import Tailwind from "./Tailwind.svelte";
  //import some Svelte Figma UI components
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import Select from "./ui/Select.svelte";

  //menu items, this is an array of objects to populate to our select menus
  let menuItems = [
    { value: "rectangle", label: "Rectangle", group: null, selected: false },
    { value: "triangle", label: "Triangle ", group: null, selected: false },
    { value: "circle", label: "Circle", group: null, selected: false },
  ];
  window.oncontextmenu = null;

  var disabled = true;
  var selectedShape;
  var count = 5;
  const version = "v2.0.0";

  //this is a reactive variable that will return false when a value is selected from
  //the select menu, its value is bound to the primary buttons disabled prop
  $: disabled = selectedShape === null;

  function createShapes() {
    parent.postMessage(
      {
        pluginMessage: {
          type: "create-shapes",
          count: count,
          shape: selectedShape.value,
        },
      },
      "*"
    );
  }
  let state = "inactive";
  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }
</script>

<Tailwind />
<div class="flex flex-col h-full justify-between">
  <main class="p-xxs">
    <Label>Object</Label>
    <Select bind:state type="Vector Path" />
    <SelectMenu bind:menuItems bind:value={selectedShape} class="" />

    <Label>Count</Label>
    <Input iconText="#" bind:value={count} class="mb-xxsmall" />
  </main>
  <footer>
    <div class="p-xxs flex justify-between">
      <Button on:click={cancel} variant="secondary" class="mr-xsmall">
        Cancel
      </Button>
      <Button on:click={createShapes} bind:disabled>Create shapes</Button>
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
