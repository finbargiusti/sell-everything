
window.addEventListener('load', () => {
  console.log('Theme script loaded');
  const isWindowDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(isWindowDark);
  document.getElementById('colorscheme-changer')?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    setTheme(!isDark);
  });
});

const setTheme = (isDark: boolean) => {
  const theme = isDark ? 'dark' : 'light';
  const oldTheme = isDark ? 'light' : 'dark';
  const elements = document.querySelectorAll('.' + oldTheme);
  elements.forEach((element) => {
    element.classList.remove(oldTheme);
    element.classList.add(theme);
  });
}
