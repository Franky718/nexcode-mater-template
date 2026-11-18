// ====================================================================
// NEXCODE GENERAL STORAGE & PERSISTENCE ENGINE (Vault Omega Secured)
// Titular: fg782270@gmail.com
// ====================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../../outputs/data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function guardarRegistroGeneral(coleccion, datos) {
    const timestamp = new Date().toISOString();
    const idRegistro = crypto.randomUUID();
    const archivoRuta = path.join(DATA_DIR, `${coleccion}.json`);

    let registros = [];
    if (fs.existsSync(archivoRuta)) {
        try {
            const contenidoActual = fs.readFileSync(archivoRuta, 'utf8');
            registros = JSON.parse(contenidoActual);
        } catch (e) {
            registros = [];
        }
    }

    const nuevoElemento = {
        id: idRegistro,
        titular: "fg782270@gmail.com",
        createdAt: timestamp,
        ...datos
    };

    registros.push(nuevoElemento);
    fs.writeFileSync(archivoRuta, JSON.stringify(registros, null, 2), 'utf8');

    console.log(`[💾 PERSISTENCIA GENERAL] Guardado exitoso en [${coleccion}] con ID: ${idRegistro}`);
    return { success: true, id: idRegistro, data: nuevoElemento };
}

function leerRegistrosGenerales(coleccion) {
    const archivoRuta = path.join(DATA_DIR, `${coleccion}.json`);
    if (!fs.existsSync(archivoRuta)) return [];
    try {
        const contenido = fs.readFileSync(archivoRuta, 'utf8');
        return JSON.parse(contenido);
    } catch (e) {
        return [];
    }
}

module.exports = { guardarRegistroGeneral, leerRegistrosGenerales };
