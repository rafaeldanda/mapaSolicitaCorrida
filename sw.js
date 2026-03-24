// 3. RASTREAMENTO E WEBHOOK (Versão de Alta Persistência)
const n8n_webhook = "https://primary-production-a103.up.railway.app/webhook/91e80c8e-2309-4dd4-8512-f0dc5c4af856";
let pings = 0;
let lastPing = 0;
let watchID = null;

// Função para manter o processo "quente"
async function iniciarRastreamento() {
    if ("geolocation" in navigator) {
        // Opções críticas para o Background
        const options = {
            enableHighAccuracy: true, // Força o hardware do GPS a ficar ligado
            maximumAge: 0,            // Não aceita posições em cache
            timeout: 60000            // Tempo limite de busca
        };

        // Limpa qualquer rastro anterior antes de começar
        if (watchID) navigator.geolocation.clearWatch(watchID);

        watchID = navigator.geolocation.watchPosition(enviarPosicao, 
            (err) => { 
                atualizarUI("Erro GPS: " + err.code);
                // Se der erro, tenta reiniciar o GPS automaticamente após 5s
                setTimeout(iniciarRastreamento, 5000);
            }, 
            options
        );
        
        // Ativa o WakeLock para impedir que a CPU hiberne
        solicitarWakeLock();
    }
}

async function enviarPosicao(pos) {
    const agora = Date.now();
    
    // Filtro de 1 minuto (58s)
    if (agora - lastPing < 58000) return; 
    
    lastPing = agora;
    const { latitude, longitude } = pos.coords;

    // A mágica: usamos fetch com a flag 'keepalive'
    // Isso diz ao navegador: "Mesmo se eu for minimizado, termine esta requisição"
    try {
        const url = `${n8n_webhook}?token=${motoristaToken}&lat=${latitude}&lon=${longitude}&ping=${pings + 1}`;
        
        const response = await fetch(url, { 
            method: 'GET',
            keepalive: true, // ESSENCIAL PARA BACKGROUND
            mode: 'no-cors'  // Ajuda a evitar bloqueios de política de rede em segundo plano
        });

        pings++;
        document.getElementById('contador').innerText = pings;
        atualizarUI("Sinal enviado (Background OK)");
        
    } catch (e) { 
        atualizarUI("Tentando reconectar..."); 
    }
}

// Chamar ao carregar a página
iniciarRastreamento();
