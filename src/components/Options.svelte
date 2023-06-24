<script lang="ts">
  import { optionsType } from "../../config";
  import { Switch } from "figma-plugin-ds-svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { postMessage } from "./util/message";
  import Slider from "./Slider.svelte";
  import debounce from "./util/debounce";

  let timer;
  let radioValue;
  let options: optionsType | null = null;
  $: updateOptions(options);
  function slowDown(count) {
    if (count > 500) return 750;
    if (count > 300) return 300;
    if (count > 50) return 150;
    return 100;
  }
  export const onOptionsChange = (msg) => {
    if (msg.type === "options:get") {
      options = msg.options as optionsType;
    }
  };
  const update = (e, optionData) => debounce();
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
        <button class="rounded-l px-xxs border border-r-transparent">
          AUTO
        </button>
        <button class="rounded-r px-xxs border">Manual</button>
      </div>
    </div>
    <Slider
      value={options.count}
      min={2}
      max={50}
      id="slider-Spacing"
      label="Spacing"
      on:change={(e) => debounce(() => (options.count = e.detail.value), 300)}
    />
    <Slider
      value={options.count}
      min={2}
      max={50}
      id="slider-Offset"
      label="Offset"
      on:change={(e) => (options.count = e.detail.value)}
    />
    <div class="">
      <Switch>Rotate Object Along Path</Switch>
      <Switch>Reverse Direction</Switch>
    </div>
  </div>
{/if}

<style lang="postcss">
</style>
