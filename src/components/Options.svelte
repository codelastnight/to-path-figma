<script lang="ts">
  import { optionsType } from "../../config";
  import { Input, IconTidyUpGrid, Label } from "figma-plugin-ds-svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { postMessage } from "./util";

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
  function handleSlider(e) {
    const data = e.detail;
    options.count = data.value;
  }
</script>

{#if !!options}
  <div class="px-xxs">
    <Label>Count</Label>
    <div class="flex items-center gap-xxs">
      <Input
        class="basis-0 min-w-[5rem] "
        bind:value={options.count}
        iconName={IconTidyUpGrid}
      />
      <div class="w-full">
        <RangeSlider
          values={[options.count]}
          min={2}
          max={50}
          id="slider-count"
          on:change={handleSlider}
        />
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
</style>
