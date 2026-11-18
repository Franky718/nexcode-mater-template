const { WebSocketServer } = require('ws');

function iniciarServidorJuego(puerto = 8080) {
    const wss = new WebSocketServer({ port: puerto });
    console.log(`🎮 [Game Server] Servidor de WebSockets activo en el puerto ${puerto}`);

    wss.on('connection', (ws) => {
        console.log('🔌 [Game Server] Nuevo cliente/jugador conectado a la red local.');

        ws.on('message', (message) => {
            try {
                const evento = JSON.parse(message);
                switch (evento.tipo) {
                    case 'UNIRSE_SALA':
                        ws.salaId = evento.salaId;
                        ws.jugadorNombre = evento.nombre;
                        console.log(`🕹️ Jugador [${ws.jugadorNombre}] ingresó a la sala: ${ws.salaId}`);
                        break;
                    case 'MOVIMIENTO_JUGADOR':
                        wss.clients.forEach(client => {
                            if (client !== ws && client.readyState === 1 && client.salaId === ws.salaId) {
                                client.send(JSON.stringify({
                                    tipo: 'ACTUALIZAR_POSICION',
                                    jugador: ws.jugadorNombre,
                                    posicion: evento.posicion
                                }));
                            }
                        });
                        break;
                }
            } catch (err) {
                console.error('❌ Error al procesar paquete de datos de juego:', err.message);
            }
        });
    });
}

module.exports = { iniciarServidorJuego };
