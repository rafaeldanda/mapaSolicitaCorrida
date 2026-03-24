<script>
    // 1. GESTÃO DO TOKEN
    const urlParams = new URLSearchParams(window.location.search);
    let motoristaToken = urlParams.get('token') || localStorage.getItem('me_leva_token') || "Sem_Token";
    if (urlParams.get('token')) localStorage.setItem('me_leva_token', motoristaToken);
    document.getElementById('display-token').innerText = motoristaToken;

    // 2. VARIÁVEIS DE CONTROLE
    const n8n_webhook = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
    let pings = 0;
    let lastPing = 0;
    let wakeLock = null;

    // 3. FUNÇÃO DE ENVIO (O SEGREDO PARA BACKGROUND)
    async function enviarPosicao(pos) {
        const agora = Date.now();
        if (agora - lastPing < 10000) return; // Filtro de ~1 minuto
        
        lastPing = agora;
        const { latitude, longitude, speed } = pos.coords;

        const url = `${n8n_webhook}?token=${motoristaToken}&lat=${latitude}&lon=${longitude}&ping=${pings + 1}&speed=${speed || 0}`;

        try {
            // Usamos 'keepalive' para o navegador não cancelar o envio ao minimizar
            await fetch(url, { 
                method: 'GET', 
                keepalive: true, 
                mode: 'no-cors' 
            });
            
            pings++;
            document.getElementById('contador').innerText = pings;
            atualizarUI("Sinal enviado (Background Ativo)");
        } catch (e) {
            atualizarUI("Erro na rede, tentando manter GPS...");
        }
    }

    // 4. MANTER O PROCESSO VIVO
    async function ativarWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
            }
        } catch (err) { console.log("WakeLock negado."); }
    }

    // Reativar tudo se o usuário voltar ou minimizar
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            ativarWakeLock();
        }
    });

    function atualizarUI(msg) {
        document.getElementById('log').innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        const led = document.getElementById('led-signal');
        led.classList.add('led-active');
        setTimeout(() => led.classList.remove('led-active'), 1000);
    }

    // 5. INICIALIZAÇÃO DO RASTREIO
    if ("geolocation" in navigator) {
        ativarWakeLock();
        
        // O watchPosition é um evento do SISTEMA, ele "acorda" o app
        navigator.geolocation.watchPosition(enviarPosicao, 
            (err) => { atualizarUI("Erro GPS: " + err.code); }, 
            { 
                enableHighAccuracy: true, 
                maximumAge: 0, 
                timeout: 30000 
            }
        );
    }

    // Registro do Service Worker v2
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js');
    }
</script>
