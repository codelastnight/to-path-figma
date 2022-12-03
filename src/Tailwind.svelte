<style global lang="postcss">
  @tailwind utilities;
  @tailwind components;
  @tailwind base;
  @layer components {
    .icon {
      @apply w-[32px] h-[32px];
      flex-shrink: 0;
    }
    .figma-divider {
      @apply border-t w-full;
      border-color: var(--figma-color-border);
    }
  }
  #slider-count {
    @apply text-xs;
  }
</style>
