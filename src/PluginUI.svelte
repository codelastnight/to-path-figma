<script lang="ts">
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";

  import Tailwind from "./Tailwind.svelte";
  //import some Svelte Figma UI components
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import ObjectSelector from "./components/ObjectSelector.svelte";

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

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }
</script>

<Tailwind />
<div class="flex flex-col h-full justify-between">
  <main class="">
    <header class="px-xxs">
      <ObjectSelector />
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
