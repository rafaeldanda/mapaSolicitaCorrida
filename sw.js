let deferredPrompt;
const btnInstalar = document.getElementById("btnInstalar");

// 🔍 Verifica se já está instalado
function isPWAInstalled() {
return window.matchMedia('(display-mode: standalone)').matches
|| window.navigator.standalone === true;
}

// 🚀 Se já estiver instalado, esconde botão
if (isPWAInstalled()) {
console.log("App já instalado");
btnInstalar.style.display = "none";
} else {

```
// Captura evento de instalação
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    btnInstalar.style.display = "block";
});
```

}

// Clique no botão
btnInstalar.addEventListener("click", async () => {
if (!deferredPrompt) return;

```
deferredPrompt.prompt();

const { outcome } = await deferredPrompt.userChoice;

if (outcome === "accepted") {
    console.log("Usuário instalou");
    btnInstalar.style.display = "none";
} else {
    console.log("Usuário cancelou");
}

deferredPrompt = null;
```

});

// Evento após instalação
window.addEventListener("appinstalled", () => {
console.log("App instalado com sucesso");
btnInstalar.style.display = "none";
});
