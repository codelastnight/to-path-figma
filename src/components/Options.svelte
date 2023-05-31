<script lang="ts">
  import { optionsType } from "../../config";
  import { Input, IconTidyUpGrid, Label } from "figma-plugin-ds-svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { postMessage } from "./util";
  import Slider from "./Slider.svelte";

  let timer;
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
  <div class="px-xxs">
    <div class="w-full">
      <Slider
        value={options.count}
        min={2}
        max={50}
        id="slider-count"
        label="Count"
        iconName={IconTidyUpGrid}
        on:change={(e) => (options.count = e.detail.value)}
      />
    </div>
  </div>
{/if}

<style lang="postcss">
</style>
