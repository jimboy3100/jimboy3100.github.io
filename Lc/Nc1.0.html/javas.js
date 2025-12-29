// LOADER
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});

// MENU MOBILE
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
