// Gerenciar tema claro/escuro
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Carregar tema salvo
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

// Aplicar tema
function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}

// Toggle tema
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  });
}

// Carregar tema ao iniciar
loadTheme();

// Detectar preferência do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  if (!localStorage.getItem('theme')) {
    applyTheme('dark');
  }
}
