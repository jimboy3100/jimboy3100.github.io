document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert("Mensagem enviada com sucesso!");
            form.reset();
            document.getElementById("nome-arquivo").textContent = "Nenhum arquivo escolhido";
        } else {
            alert("Erro ao enviar o formulário.");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
});
