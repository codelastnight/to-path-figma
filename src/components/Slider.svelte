<script lang="ts">
  /**modified from:
   * https://svelte.dev/repl/7f0042a186ee4d8e949c46ca663dbe6c?version=3.33.0
   */
  import { createEventDispatcher } from "svelte";
  import { Input, Label, IconLayoutGridUniform } from "figma-plugin-ds-svelte";
  import debounce from "./util/debounce";
  import { fly, fade } from "svelte/transition";

  // Props
  export let min = 0;
  export let max = 100;
  export let initialValue = 0;
  export let id = null;
  export let value =
    typeof initialValue === "string" ? parseInt(initialValue) : initialValue;

  export let label = "label";
  export let iconName = null;
  // Node Bindings
  let container = null;
  let thumb = null;
  let progressBar = null;
  let element = null;

  // Internal State
  let elementX = null;
  let currentThumb = null;
  let holding = false;
  let thumbHover = false;
  let keydownAcceleration = 0;
  let accelerationTimer = null;

  const onInputSet = debounce((e) => {
    const val = e.target.value;
    if (!val || val === "") return;

    setValue(typeof val === "string" ? parseInt(val) : val);
  }, 200);

  // Dispatch 'change' events
  const dispatch = createEventDispatcher();

  // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
  // ie. hover events on other elements while dragging. Especially for Safari
  const mouseEventShield = document.createElement("div");
  mouseEventShield.setAttribute("class", "mouse-over-shield");
  mouseEventShield.addEventListener("mouseover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  function resizeWindow() {
    elementX = element.getBoundingClientRect().left;
  }

  // Allows both bind:value and on:change for parent value retrieval
  function setValue(val) {
    value = val;
    dispatch("change", { value });
  }

  function onTrackEvent(e) {
    // Update value immediately before beginning drag
    updateValueOnEvent(e);
    onDragStart(e);
  }

  function onHover(e) {
    thumbHover = thumbHover ? false : true;
  }

  function onDragStart(e) {
    // If mouse event add a pointer events shield
    if (e.type === "mousedown") document.body.append(mouseEventShield);
    currentThumb = thumb;
  }

  function onDragEnd(e) {
    // If using mouse - remove pointer event shield
    if (e.type === "mouseup") {
      if (document.body.contains(mouseEventShield))
        document.body.removeChild(mouseEventShield);
      // Needed to check whether thumb and mouse overlap after shield removed
      if (isMouseInElement(e, thumb)) thumbHover = true;
    }
    currentThumb = null;
  }

  // Check if mouse event cords overlay with an element's area
  function isMouseInElement(event, element) {
    let rect = element.getBoundingClientRect();
    let { clientX: x, clientY: y } = event;
    if (x < rect.left || x >= rect.right) return false;
    if (y < rect.top || y >= rect.bottom) return false;
    return true;
  }

  // Accessible keypress handling
  function onKeyPress(e) {
    // Max out at +/- 10 to value per event (50 events / 5)
    // 100 below is to increase the amount of events required to reach max velocity
    if (keydownAcceleration < 50) keydownAcceleration++;
    let throttled = Math.ceil(keydownAcceleration / 5);

    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      if (value + throttled > max || value >= max) {
        setValue(max);
      } else {
        setValue(value + throttled);
      }
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      if (value - throttled < min || value <= min) {
        setValue(min);
      } else {
        setValue(value - throttled);
      }
    }

    // Reset acceleration after 100ms of no events
    clearTimeout(accelerationTimer);
    accelerationTimer = setTimeout(() => (keydownAcceleration = 1), 100);
  }

  function calculateNewValue(clientX) {
    // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
    let delta = clientX - (elementX + 10);

    // Use width of the container minus (5px * 2 sides) offset for percent calc
    let percent = (delta * 100) / (container.clientWidth - 10);

    // Limit percent 0 -> 100
    percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;

    // Limit value min -> max
    setValue(parseInt((percent * (max - min)) / 100) + min);
  }

  // Handles both dragging of touch/mouse as well as simple one-off click/touches
  function updateValueOnEvent(e) {
    // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
    if (!currentThumb && e.type !== "touchstart" && e.type !== "mousedown")
      return false;

    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();

    // Get client's x cord either touch or mouse
    const clientX =
      e.type === "touchmove" || e.type === "touchstart"
        ? e.touches[0].clientX
        : e.clientX;

    calculateNewValue(clientX);
  }

  // React to left position of element relative to window
  $: if (element) elementX = element.getBoundingClientRect().left;

  // Set a class based on if dragging
  $: holding = Boolean(currentThumb);

  // Update progressbar and thumb styles to represent value
  $: if (progressBar && thumb) {
    // Limit value min -> max
    value = value > min ? value : min;
    //value = value < max ? value : max;

    let percent = ((value - min) * 100) / (max - min);
    let offsetLeft = container.clientWidth * (percent / 100) + 5;

    // Update thumb position + active range track width
    thumb.style.left = `${offsetLeft}px`;
    progressBar.style.width = `${offsetLeft}px`;
  }
</script>

<svelte:window
  on:touchmove|nonpassive={updateValueOnEvent}
  on:touchcancel={onDragEnd}
  on:touchend={onDragEnd}
  on:mousemove={updateValueOnEvent}
  on:mouseup={onDragEnd}
  on:resize={resizeWindow}
/>
<div>
  <div class="flex justify-between items-center pt-xxs">
    <p class="h-[20px] text-xs text-[var(--figma-color-text-secondary)]">
      {label}
    </p>

    <Input
      class="input basis-0 min-w-[5rem] "
      value={`${value}`}
      min="2"
      on:input={onInputSet}
      {iconName}
    />
  </div>
  <div class="range">
    <div
      class="range__wrapper"
      tabindex="0"
      on:keydown={onKeyPress}
      bind:this={element}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      {id}
      on:mousedown={onTrackEvent}
      on:touchstart={onTrackEvent}
    >
      <div class="range__track" bind:this={container}>
        <div class="range__track--highlighted" bind:this={progressBar} />
        <div
          class="range__thumb"
          bind:this={thumb}
          on:touchstart={onDragStart}
          on:mousedown={onDragStart}
        />
      </div>
    </div>
  </div>
</div>

<svelte:head>
  <style>
    .mouse-over-shield {
      position: fixed;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
      background-color: rgba(255, 0, 0, 0);
      z-index: 10000;
      cursor: grabbing;
    }
  </style>
</svelte:head>

<style lang="postcss">
  :global(.input > input) {
    text-align: end;
    padding-right: var(--size-xxsmall);
    @apply py-xxxs h-[20px];
  }
  .range {
    position: relative;
    flex: 1;
    --track-focus: #c368ff;
    --thumb-holding-outline: rgba(191, 102, 251, 0.3);
    border-radius: var(--size-xxsmall);

    /* padding: 0 var(--size-xxsmall); */
  }

  .range__wrapper {
    box-sizing: border-box;
    outline: none;
    @apply relative cursor-pointer min-w-full;
    @apply py-xxs;
  }

  .range__wrapper:hover > .range__track,
  .range__wrapper:active > .range__track {
    background: var(--figma-color-bg-tertiary);
  }

  .range__wrapper:focus-visible {
    box-shadow: 0 0 0 2px var(--figma-color-bg),
      0 0 0 3px var(--track-focus, #6185ff);
  }

  .range__track {
    height: 2px;
    background-color: var(--figma-color-bg-tertiary);
  }

  .range__track--highlighted {
    background: var(--figma-color-text-onselected-tertiary);
    width: 0;
    height: 2px;
    position: absolute;
    /* border-radius: 999px; */
  }
  .range__wrapper:hover .range__track--highlighted,
  .range__wrapper:active .range__track--highlighted {
    background: var(--figma-color-bg-brand);
  }

  .range__thumb {
    width: 12px;
    height: 12px;
    @apply rounded-full bg-[var(--figma-color-bg)] -ml-[12px] -mt-[6px];
    @apply absolute border-[1.2px] border-[var(--figma-color-text-onselected-tertiary)] cursor-pointer transition scale-90;
    user-select: none;
  }
  .range__thumb:hover {
    background-color: var(--figma-color-bg-selected);
  }
  .range__thumb:active {
    background-color: var(--figma-color-bg-selected-strong);
  }
  .range__wrapper:hover .range__thumb,
  .range__wrapper:active .range__thumb {
    @apply scale-100;
  }
  .range__thumb--holding {
  }
</style>
