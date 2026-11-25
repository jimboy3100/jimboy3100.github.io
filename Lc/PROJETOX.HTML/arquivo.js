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
            alert(lmT("site.lc.projetox.messageSent"));
            form.reset();
            document.getElementById("nome-arquivo").textContent = lmT("site.lc.projetox.noFileChosen");
        } else {
            alert(lmT("site.lc.projetox.sendError"));
        }
    } catch (error) {
        alert(lmT("site.lc.projetox.connectionError"));
    }
});
