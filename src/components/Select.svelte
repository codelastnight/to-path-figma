<script lang="ts">
  import CursorIcon from "./icons/cursor.svg";
  import X from "./icons/x.svg";
  import { Button } from "figma-plugin-ds-svelte";
  import { createEventDispatcher } from "svelte";

  export let type: string = "";
  export let state: string = "inactive";
  export let icons: any[] = ["", "", ""];
  export let objectName = "";
  export let altIcon = false;
  //$: if (!!objectName) state = "set";

  const dispatch = createEventDispatcher();

  const clear = () => {
    dispatch("clear");
    state = "active";
  };
  const active = () => dispatch("active");

  const btnState = {
    inactive: `No ${type} Selected`,
    active: `Select a ${type}`,
    set: "",
  };
  const iconState = {
    inactive: icons[0],
    active: CursorIcon,
    set: icons[altIcon ? 2 : 1],
  };
</script>

{#if state === "set"}
  <div class={`button justify-between ${state}`}>
    <div class="flex gap-xxxs items-center button-text">
      <div class="icon">
        {@html iconState[state]}
      </div>
      <p class="truncate">
        {objectName}
      </p>
    </div>
    <button class="p-0 icon icon-button" on:click={clear}>
      {@html X}
    </button>
  </div>
{:else}
  <button type="button" class={`button ${state}`} on:click={active}>
    <div class="flex gap-xxxs items-center">
      <div class="icon">
        {@html iconState[state]}
      </div>
      {btnState[state]}
    </div>
  </button>
{/if}

<style lang="postcss">
  /* this is an attempt at more semantic css in tailwind */
  .button {
    @apply px-xxxs rounded-md;
    @apply flex items-center w-full;
    @apply text-sm border-[1.5px] border-transparent;
  }
  .inactive {
    @apply hover:bg-[var(--figma-color-bg-hover)];
    @apply cursor-pointer;
    @apply text-[var(--figma-color-text)];
  }
  .active {
    @apply text-[var(--figma-color-text)];

    @apply border-dashed border-[var(--figma-color-border-selected)];
    @apply font-medium bg-[var(--figma-color-bg-selected)] text-[var(--figma-color-text-selected)];
  }
  .set {
    @apply bg-[var(--figma-color-bg-inverse)];
    @apply text-[var(--figma-color-text-oninverse)];
  }
  .icon-button:hover {
    @apply bg-[var(--figma-color-icon-hover)];
  }
  .button-text {
    flex: 1;
    min-width: 0;
  }
</style>
