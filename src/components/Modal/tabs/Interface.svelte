<script>
  const themes = [
    {
      value: "light theme",
      theme: "./themes/light",
    },
    {
      value: "dark theme",
      theme: "./themes/dark",
    },
    {
      value: "black (AMOLED)",
      theme: "./themes/black",
    },
  ];

  let activeTheme = themes[2].theme;

  function changeTheme() {
    if (document.getElementById("theme_style"))
      document.getElementById("theme_style").href = activeTheme + ".css";
  }

  $: if (activeTheme) changeTheme();

  let accentColors = [
    {
      target: "color_one",
      color: "#4DC853",
    },
    {
      target: "color_two",
      color: "#F75052",
    },
    {
      target: "color_three",
      color: "#D53400",
    },
    {
      target: "color_four",
      color: "#F64A81",
    },
    {
      target: "color_five",
      color: "#C63961",
    },
    {
      target: "color_six",
      color: "#E265FA",
    },
    {
      target: "color_seven",
      color: "#AD60FF",
    },
    {
      target: "color_eight",
      color: "#7D5BFF",
    },
  ];
  let activeAccentColor = accentColors[0].color;

  function changeAccentColor() {
    let accent = accentColors.filter((c) => c.color === activeAccentColor);
    document.documentElement.querySelector("body").className = accent[0].target;
  }

  $: if (activeAccentColor) changeAccentColor();
</script>

<div class="interface">
  <h4>Theme</h4>
  <div class="theme-container">
    {#each themes as { value, theme }}
      <label>
        <div class="theme-radio">
          <div class="theme-color" class:active={theme === activeTheme} />
          <div class="theme-ring" class:active={theme === activeTheme} />
        </div>
        <input
          bind:group={activeTheme}
          type="radio"
          name="theme-color"
          value={theme} />
        <h4>{value}</h4>
      </label>
    {/each}
  </div>
  <h4>Accent color</h4>

  <div class="accent-container">
    {#each accentColors as value}
      <label>
        <div
          class="accent-color"
          class:active={value.color === activeAccentColor}
          style="background-color: {value.color}" />
        <div
          class="accent-ring"
          class:active={value.color === activeAccentColor}
          style="border: 2px solid {value.color}" />
        <input
          bind:group={activeAccentColor}
          type="radio"
          name="accent-color"
          value={value.color} />
      </label>
    {/each}
  </div>
</div>
