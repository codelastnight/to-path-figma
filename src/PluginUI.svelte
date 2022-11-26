<script lang="ts">
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";

  import Tailwind from "./Tailwind.svelte";
  //import some Svelte Figma UI components
  import { Button, Input, Label, SelectMenu } from "figma-plugin-ds-svelte";
  import ObjectSelector from "./components/ObjectSelector.svelte";
  import Options from "./components/Options.svelte";

  window.oncontextmenu = null;

  var disabled = true;
  const version = "v2.0.0";

  let onSelection;
  let onOptionsChange;

  onmessage = (event) => {
    const msg = event.data.pluginMessage;
    onSelection(msg);
    onOptionsChange(msg);
  };

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }
</script>

<Tailwind />
<div class="flex flex-col h-full justify-between">
  <main class="">
    <header class="px-xxs">
      <ObjectSelector bind:onSelection />
    </header>

    <div class="figma-divider mt-xxs" />
    <Options bind:onOptionsChange />
  </main>
  <footer>
    <div class="figma-divider" />
    <div class="p-xxs flex justify-between">
      <Button on:click={cancel} variant="tertiary" class="mr-xsmall">
        Tutorial
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
