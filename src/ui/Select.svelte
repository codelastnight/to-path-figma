<script lang="ts">
  import cursorIcon from "./icons/cursor.svg";
  export let type: string = "";
  export let state: btnStateType = "inactive";
  export let icons: any[] = [];
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
</script>

<button type="button">
  {btnState[state]}
</button>

<style>
  button {
    @apply px-xxs py-xxxs;
  }
</style>
