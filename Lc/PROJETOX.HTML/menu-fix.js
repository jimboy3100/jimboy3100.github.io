document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener('click', function() {
    menu.classList.toggle('active');
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('active');
    });
  });
});
