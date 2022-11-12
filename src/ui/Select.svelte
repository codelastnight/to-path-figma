<script lang="ts">
  import cursorIcon from "./icons/cursor.svg";
  import x from "./icons/x.svg";
  import { Button } from "figma-plugin-ds-svelte";

  export let type: string = "";
  export let state: string = "inactive";
  export let icons: any[] = ["", ""];
  const btnState = {
    inactive: `No ${type} Selected`,
    active: `Select a ${type}`,
    set: type,
  };
  const iconState = {
    inactive: icons[0],
    active: cursorIcon,
    set: icons[1],
  };
  type btnStateType = keyof typeof btnState;
  function setactive() {
    if (state === "inactive") {
      state = "active";
    }
  }
  function close() {
    if (state === "set") state = "active";
  }
</script>

<button type="button" class={state} on:click={setactive}>
  <div>
    {@html iconState[state]}
    {btnState[state]}
  </div>
  {#if (state = "set")}
    <Button on:click|stopPropagation={close}>
      {@html x}
    </Button>
  {/if}
</button>

<style lang="postcss">
  /* this is an attempt at more semantic css in tailwind */
  button {
    @apply px-xxs py-xxxs rounded-md;
    @apply flex gap-xxs;
    @apply text-md font-bold;
  }
  .inactive {
    @apply hover:bg-[var(--figma-color-bg-hover)];
    @apply font-medium cursor-pointer;
  }
  .active {
    @apply border-2 border-dotted border-spacing-xxxs;
    @apply bg-[var(--figma-color-bg-selected-pressed)];
  }
  .set {
    @apply bg-[var(--figma-color-bg-inverse)];
    @apply text-[var(--figma-color-text-oninverse)];
  }
</style>
