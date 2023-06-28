<script lang="ts">
  import { optionsType } from "../../config";
  import { Switch } from "figma-plugin-ds-svelte";
  import { postMessage } from "./util/message";
  import Slider from "./Slider.svelte";
  import debounce from "./util/debounce";

  let timer;
  let radioValue;

  let options: optionsType | undefined = undefined;
  $: updateOption(options);
  function slowDown(count) {
    if (count > 500) return 500;
    if (count > 300) return 200;
    if (count > 50) return 150;
    return 100;
  }
  export const onOptionsChange = (msg) => {
    if (msg.type === "options:get") {
      options = msg.options as optionsType;
    }
  };
  const updateOption = debounce((optionData) => {
    postMessage("options:set", { options: optionData });
  }, 200);
  function updateOptions(optionData) {
    //debounce
    const time = !!options ? slowDown(options.count) : 150;
    clearTimeout(timer);

    timer = setTimeout(() => {
      postMessage("options:set", { options: optionData });
    }, time);
  }
</script>

{#if !!options}
  <div class="px-xxs w-full">
    <Slider
      value={options.count}
      min={2}
      max={50}
      id="slider-count"
      label="Count"
      on:change={(e) => (options.count = e.detail.value)}
    />
    <div class="flex justify-between">
      <p class="text-xs">Spacing Mode</p>
      <div class="flex text-xs">
        <button
          class="rounded-l px-xxs border border-r-transparent"
          class:active={options.autoWidth}
          on:click={() => (options.autoWidth = true)}
        >
          AUTO
        </button>
        <button
          class="rounded-r px-xxs border"
          class:active={!options.autoWidth}
          on:click={() => (options.autoWidth = false)}
        >
          Manual
        </button>
      </div>
    </div>
    <Slider
      value={options.spacing}
      min={2}
      max={50}
      id="slider-Spacing"
      label="Spacing"
      on:change={(e) => () => (options.spacing = e.detail.value)}
    />
    <Slider
      value={options.offset}
      min={2}
      max={50}
      id="slider-Offset"
      label="Offset"
      on:change={(e) => (options.offset = e.detail.value)}
    />
    <div class="">
      <Switch>Rotate Object Along Path</Switch>
      <Switch>Reverse Direction</Switch>
    </div>
  </div>
{/if}

<style lang="postcss">
</style>
