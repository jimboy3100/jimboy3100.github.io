document.addEventListener("DOMContentLoaded", () => {
    const formSection = document.querySelector(".section-form");

    setTimeout(() => {
        formSection.style.opacity = "1";
        formSection.style.transform = "translateY(0)";
        formSection.style.transition = "0.8s ease";
    }, 200);
});
