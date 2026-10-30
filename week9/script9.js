const themeButton = document.getElementById("themeToggle");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    themeButton.textContent = isDark ? "☀" : "☾";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute(
      "aria-label",
      isDark ? "Enable light mode" : "Enable dark mode"
    );
  });
}
