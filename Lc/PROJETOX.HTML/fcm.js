  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const links = menu.querySelectorAll("a");

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });

