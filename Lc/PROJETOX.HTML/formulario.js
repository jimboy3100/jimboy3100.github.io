document.addEventListener("DOMContentLoaded", () => {
    const formSection = document.querySelector(".section-form");

    // Animação de entrada
    setTimeout(() => {
        formSection.style.opacity = "1";
        formSection.style.transform = "translateY(0)";
        formSection.style.transition = "0.8s ease";
    }, 200);

    // Animação ao enviar
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        form.style.transform = "scale(0.95)";
        form.style.transition = "0.2s";

        setTimeout(() => {
            alert("Mensagem Enviada Com Sucesso!");
            form.reset();
            form.style.transform = "scale(1)";
        }, 200);
    });
});
