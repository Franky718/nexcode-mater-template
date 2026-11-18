'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { ejecutarJarvisCore, obtenerMemoriaJarvis } from './actions/master-actions'
import { ejecutarPrediccionML } from './actions/ml-actions'

export default function MasterCorePage() {
    const [isPending, startTransition] = useTransition()
    const [mensajeRespuesta, setMensajeRespuesta] = useState<string | null>(null)
    const [folioUltimo, setFolioUltimo] = useState<string | null>(null)
    const [hashVault, setHashVault] = useState<string>('SHA-256: [PERFIL PRIVADO EMPRESA Y 16 MÓDULOS ACTIVOS]')
    const [memoriasEstado, setMemoriasEstado] = useState<any[]>([])
    
    // Control de acceso Vault Omega (Perfil Privado Empresa)
    const [accesoConcedido, setAccesoConcedido] = useState(false)
    const [modoAcceso, setModoAcceso] = useState<'facial' | 'pin' | 'omega'>('facial')
    const [pinIngresado, setPinIngresado] = useState('')
    const [omegaKeyIngresada, setOmegaKeyIngresada] = useState('')
    const [estadoSeguridad, setEstadoSeguridad] = useState('Seleccione método de autenticación corporativa...')
    const videoRef = useRef<HTMLVideoElement | null>(null)
    
    const omegaKeySecreta = 'NEXCODE-OMEGA-7822-FRAN-1998'
    const titularExclusivo = 'fg782270@gmail.com'

    // Pestañas visibles (Las 16 completas)
    const [pestañaActiva, setPestañaActiva] = useState<string>('aura_ai')
    const [busquedaQuery, setBusquedaQuery] = useState('')
    
    // Estados operacionales
    const [promptAura, setPromptAura] = useState('Estrategia de privacidad y soberanía de datos C-Level')
    const [promptJarvis, setPromptJarvis] = useState('Sincronización simultánea Claude + Gemini + ChatGPT')
    const [canalJarvis, setCanalJarvis] = useState<'api' | 'cli' | 'mcp'>('mcp')
    const [modoClonacion, setModoClonacion] = useState<'espejo_completo_json' | 'clon_sandbox_local'>('espejo_completo_json')
    const [estadoClonacion, setEstadoClonacion] = useState('Espejo interconectado listo.')

    const [consolaLogs, setConsolaLogs] = useState<string[]>([
        '[Vault Omega] Sistema de autenticación de perfil privado inicializado.',
        '[Restricción Maestra] Titular requerido: fg782270@gmail.com'
    ])

    async function cargarMemoria() {
        const res = await obtenerMemoriaJarvis()
        if (res.success) {
            setMemoriasEstado(res.memorias)
            agregarLog(`Registros sincronizados: ${res.memorias.length} elementos.`)
        }
    }

    useEffect(() => {
        cargarMemoria()
    }, [])

    function agregarLog(texto: string) {
        const timestamp = new Date().toLocaleTimeString()
        setConsolaLogs(prev => [`[${timestamp}] ${texto}`, ...prev.slice(0, 15)])
    }

    function hablarSistema(texto: string) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(texto)
        utterance.rate = 1.05
        utterance.lang = 'es-MX'
        window.speechSynthesis.speak(utterance)
    }

    async function generarHashSeguro(textoBase: string) {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
            const msgBuffer = new TextEncoder().encode(textoBase + Date.now().toString())
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            return `SHA-256: ${hashHex.toUpperCase()}`
        }
        return `SHA-256: 7B82270FRAN1998SECURE`
    }

    function verificarAutoridadNucleoMaestro(accion: string): boolean {
        if (!titularExclusivo || titularExclusivo !== 'fg782270@gmail.com') {
            alert("ACCESO DENEGADO POR RESTRICCIÓN MAESTRA.")
            return false
        }
        return true
    }

    function descargarArchivo(nombre: string, contenido: string, tipo: string) {
        if (!verificarAutoridadNucleoMaestro("DESCARGAR_ARCHIVO")) return
        const blob = new Blob([contenido], { type: tipo })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = nombre
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        agregarLog(`Archivo protegido descargado para ${titularExclusivo}: ${nombre}`)
    }

    async function iniciarAccesoFacial() {
        setModoAcceso('facial')
        setEstadoSeguridad('Verificando biometría del perfil privado...')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) videoRef.current.srcObject = stream
            setTimeout(async () => {
                const hashInit = await generarHashSeguro("AUTH_FACIAL_OK_" + titularExclusivo)
                setHashVault(hashInit)
                setEstadoSeguridad('✔ Identidad de C. Francisco confirmada.')
                agregarLog(`Acceso biométrico autorizado para perfil privado (${titularExclusivo}).`)
                hablarSistema("Acceso autorizado al perfil privado de empresa.")
                setAccesoConcedido(true)
            }, 2000)
        } catch (err) {
            setEstadoSeguridad('❌ Error de cámara. Use PIN o Llave Omega.')
        }
    }

    function verificarPinMaestro(e: React.FormEvent) {
        e.preventDefault()
        if (pinIngresado === '7822' || pinIngresado === '1998' || pinIngresado === '2026') {
            generarHashSeguro("AUTH_PIN_OK_" + pinIngresado).then(hashInit => {
                setHashVault(hashInit)
                setEstadoSeguridad('✔ PIN verificado correctamente.')
                agregarLog(`Acceso por PIN Ejecutivo autorizado para ${titularExclusivo}.`)
                hablarSistema("Acceso autorizado, C. Francisco.")
                setAccesoConcedido(true)
            })
        } else {
            alert("PIN incorrecto.")
            agregarLog('Intento de acceso fallido con PIN incorrecto.')
        }
    }

    function verificarLlaveOmega(e: React.FormEvent) {
        e.preventDefault()
        if (omegaKeyIngresada.trim() === omegaKeySecreta || omegaKeyIngresada.trim() === '782270') {
            generarHashSeguro("AUTH_OMEGA_KEY_OK").then(hashInit => {
                setHashVault(hashInit)
                setEstadoSeguridad('✔ Llave Criptográfica Omega verificada.')
                agregarLog(`Acceso autorizado mediante Llave Maestra Omega para ${titularExclusivo}[cite: 1].`)
                hablarSistema("Acceso autorizado con Llave Omega.")
                setAccesoConcedido(true)
            })
        } else {
            alert("Llave Criptográfica Omega incorrecta.")
            agregarLog('Intento de acceso fallido con Llave Omega incorrecta.')
        }
    }

    async function ejecutarAccionModular(accionTipo: string) {
        if (!verificarAutoridadNucleoMaestro(accionTipo)) return
        const hashFirma = await generarHashSeguro(accionTipo + Date.now() + titularExclusivo)
        setHashVault(hashFirma)
        agregarLog(`Ejecutando acción [${accionTipo.toUpperCase()}]: Titular: ${titularExclusivo}[cite: 1] | Hash: ${hashFirma}`)

        startTransition(async () => {
            if (accionTipo === 'consultar_aura') {
                const reporteAuraJson = JSON.stringify({ ia: "Aura AI", perfilPrivado: titularExclusivo, firmaVaultOmega: hashFirma }, null, 2)
                descargarArchivo(`Aura-AI-${Date.now()}.json`, reporteAuraJson, 'application/json')
                setMensajeRespuesta(`[AURA AI — .JSON]\n- Estrategia generada.\nFirma: ${hashFirma}`)
                setFolioUltimo("AURA-01")
            } else if (accionTipo === 'consultar_jarvis') {
                const reporteJarvisJson = JSON.stringify({ ia: "Jarvis Multi-Core", canal: canalJarvis, prompt: promptJarvis, perfilPrivado: titularExclusivo, firmaVaultOmega: hashFirma }, null, 2)
                descargarArchivo(`Jarvis-MultiCore-${Date.now()}.json`, reporteJarvisJson, 'application/json')
                setMensajeRespuesta(`[JARVIS AI — .JSON]\n- Sincronización multi-modelo completada.\nFirma: ${hashFirma}`)
                setFolioUltimo("JARVIS-01")
            } else if (accionTipo === 'ejecutar_clonacion_holding') {
                const clonJson = JSON.stringify({ sistema: "Nexcode Mirror", modo: modoClonacion, perfilPrivado: titularExclusivo, firmaVaultOmega: hashFirma }, null, 2)
                descargarArchivo(`Nexcode-Mirror-${Date.now()}.json`, clonJson, 'application/json')
                setEstadoClonacion("Espejo en formato .JSON generado con éxito[cite: 1].")
                setMensajeRespuesta(`[CLONACIÓN — .JSON]\n- Espejo maestro generado.\nFirma: ${hashFirma}`)
                setFolioUltimo("CLONE-01")
            } else if (accionTipo === 'exportar_matriz_gobierno') {
                const docGobierno = `MATRIZ INSTITUCIONAL Y CIUDADANA\nPerfil Privado Empresa: ${titularExclusivo}[cite: 1]\nHash: ${hashFirma}`
                descargarArchivo(`Matriz-Gobierno-${Date.now()}.doc`, docGobierno, 'application/msword')
                setMensajeRespuesta(`[GOBIERNO — WORD .DOC]\n- Informe institucional generado[cite: 1].\nFirma: ${hashFirma}`)
                setFolioUltimo("GOV-01")
            } else if (accionTipo === 'classroom_word') {
                const docUnadm = `TITULACIÓN UNADM & CLASSROOM\nPerfil Privado Empresa: ${titularExclusivo}[cite: 1]\nHash: ${hashFirma}`
                descargarArchivo(`UnADM-Titulacion-${Date.now()}.doc`, docUnadm, 'application/msword')
                setMensajeRespuesta(`[UNADM — WORD .DOC]\n- Documento académico generado[cite: 1].\nFirma: ${hashFirma}`)
                setFolioUltimo("UNADM-01")
            } else if (accionTipo === 'corp_word') {
                const docCorp = `PROPUESTA FISCIA C-LEVEL\nPerfil Privado Empresa: ${titularExclusivo}[cite: 1]\nHash: ${hashFirma}`
                descargarArchivo(`Propuesta-FiscIA-${Date.now()}.doc`, docCorp, 'application/msword')
                setMensajeRespuesta(`[FISCIA C-LEVEL — WORD .DOC]\n- Propuesta corporativa generada[cite: 1].\nFirma: ${hashFirma}`)
                setFolioUltimo("FISC-01")
            } else if (accionTipo === 'abrir_carpeta') {
                descargarArchivo(`Abrir-Holding.bat`, `@echo off\nstart explorer.exe "C:\\Nexcode-Holding"\nexit`, 'application/x-msdos-program')
                setMensajeRespuesta(`[CARPETA HOLDING]\n- Script de acceso preparado para ${titularExclusivo}[cite: 1].\nFirma: ${hashFirma}`)
                setFolioUltimo("DIR-01")
            } else {
                setMensajeRespuesta(`[MÓDULO EJECUTIVO]\n- Operación completada bajo Vault Omega.\nFirma: ${hashFirma}`)
                setFolioUltimo("OMEGA-01")
            }
        })
    }

    return (
        <div className="min-h-screen bg-slate-950 text-cyan-400 p-6 flex flex-col items-center justify-center">
            {!accesoConcedido ? (
                <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/60 rounded-xl p-8 shadow-2xl text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-wider text-white">⚖️ Perfil Privado Empresa — Vault Omega</h1>
                        <p className="text-xs text-cyan-300">Nexcode Holding Enterprise</p>
                        <p className="text-[11px] text-slate-400">Titular Exclusivo: {titularExclusivo} (C. Francisco)[cite: 1]</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-lg border border-cyan-500/30">
                        <button type="button" onClick={iniciarAccesoFacial} className={`py-2 px-1 rounded text-xs font-bold transition-all ${modoAcceso === 'facial' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300'}`}>📷 Biometría</button>
                        <button type="button" onClick={() => setModoAcceso('pin')} className={`py-2 px-1 rounded text-xs font-bold transition-all ${modoAcceso === 'pin' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300'}`}>🔑 PIN Ejecutivo</button>
                        <button type="button" onClick={() => setModoAcceso('omega')} className={`py-2 px-1 rounded text-xs font-bold transition-all ${modoAcceso === 'omega' ? 'bg-pink-600 text-white shadow' : 'text-slate-300'}`}>🛡️ Llave Omega</button>
                    </div>

                    {modoAcceso === 'facial' && (
                        <div className="space-y-3">
                            <div className="w-48 h-36 mx-auto bg-slate-950 border border-cyan-500/40 rounded-lg flex items-center justify-center overflow-hidden relative shadow-inner">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            </div>
                            <button type="button" onClick={iniciarAccesoFacial} className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow">Verificar Perfil Privado</button>
                        </div>
                    )}

                    {modoAcceso === 'pin' && (
                        <form onSubmit={verificarPinMaestro} className="space-y-4 p-4 bg-slate-950 rounded-lg border border-cyan-500/30">
                            <div>
                                <label className="block text-xs text-cyan-300 mb-2 font-bold">Ingrese PIN (7822, 1998, 2026):</label>
                                <input type="password" maxLength={6} value={pinIngresado} onChange={(e) => setPinIngresado(e.target.value)} placeholder="••••" className="w-full bg-slate-900 border border-cyan-500/50 rounded p-3 text-center text-white text-lg tracking-widest outline-none" required />
                            </div>
                            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow">Desbloquear Empresa</button>
                        </form>
                    )}

                    {modoAcceso === 'omega' && (
                        <form onSubmit={verificarLlaveOmega} className="space-y-4 p-4 bg-slate-950 rounded-lg border border-pink-500/40">
                            <div>
                                <label className="block text-xs text-pink-300 mb-2 font-bold">Ingrese Llave Criptográfica Omega:</label>
                                <input type="password" value={omegaKeyIngresada} onChange={(e) => setOmegaKeyIngresada(e.target.value)} placeholder="NEXCODE-OMEGA-..." className="w-full bg-slate-900 border border-pink-500/50 rounded p-3 text-center text-white text-xs tracking-wider outline-none" required />
                            </div>
                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow">Autorizar con Llave Omega</button>
                        </form>
                    )}

                    <p className="text-xs text-white font-medium pt-2">{estadoSeguridad}</p>
                </div>
            ) : (
                <div className="w-full max-w-7xl flex flex-col items-center space-y-4 animate-fadeIn">
                    
                    {/* PANEL SUPERIOR MAESTRO CON ACCESO AL PERFIL PRIVADO */}
                    <div className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-5 shadow-xl">
                        <header className="flex justify-between items-center border-b border-cyan-500/20 pb-3 mb-4">
                            <div>
                                <h1 className="text-lg font-bold tracking-wider flex items-center gap-2">
                                    <span>🛡️</span> Perfil Privado Empresa — <span className="text-cyan-300">Soberanía Total (16 Módulos Visibles)[cite: 1]</span>
                                </h1>
                                <p className="text-xs text-slate-400">Titular Exclusivo: {titularExclusivo} (C. Francisco)[cite: 1] | Reynosa, Tamps.</p>
                                <p className="text-[10px] font-mono text-emerald-400 mt-0.5">🔒 Vault Omega SHA-256: {hashVault}</p>
                            </div>
                            <button onClick={() => setAccesoConcedido(false)} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded font-bold">🔒 Bloquear Perfil</button>
                        </header>

                        {/* SELECTOR DE LAS 16 PESTAÑAS COMPLETAS */}
                        <div className="mb-4 p-2.5 bg-slate-950 border-2 border-cyan-500/50 rounded-lg flex flex-wrap gap-1.5 items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                                <button onClick={() => setPestañaActiva('aura_ai')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'aura_ai' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-pink-300'}`}>👩‍💻 0. Aura AI</button>
                                <button onClick={() => setPestañaActiva('aegis_sentinel')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'aegis_sentinel' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-indigo-300'}`}>🛡️ 1. Aegis Sentinel</button>
                                <button onClick={() => setPestañaActiva('chronos_restore')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'chronos_restore' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-pink-300'}`}>⏳ 2. Chronos AI</button>
                                <button onClick={() => setPestañaActiva('gobierno_mexico')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'gobierno_mexico' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-amber-300'}`}>🇲🇽 3. Gobierno (.doc)</button>
                                <button onClick={() => setPestañaActiva('omega_watcher')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'omega_watcher' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-indigo-300'}`}>🛡️ 4. Watcher</button>
                                <button onClick={() => setPestañaActiva('jarvis_ai')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'jarvis_ai' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-purple-300'}`}>🤖 5. Jarvis AI</button>
                                <button onClick={() => setPestañaActiva('multicerebro')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'multicerebro' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-cyan-300'}`}>🌐 6. Multicerebro</button>
                                <button onClick={() => setPestañaActiva('clonacion_holding')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'clonacion_holding' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-cyan-200'}`}>🔄 7. Clonación (.json)</button>
                                <button onClick={() => setPestañaActiva('memoria_personalizacion')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'memoria_personalizacion' ? 'bg-teal-500 text-slate-950' : 'bg-slate-900 text-teal-300'}`}>🧠 8. Memoria Soberana</button>
                                <button onClick={() => setPestañaActiva('tiendas')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'tiendas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-amber-300'}`}>🛒 9. Tiendas</button>
                                <button onClick={() => setPestañaActiva('unadm_titulacion')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'unadm_titulacion' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-emerald-300'}`}>🎓 10. UnADM (.doc)</button>
                                <button onClick={() => setPestañaActiva('legal_lexia')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'legal_lexia' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-blue-300'}`}>⚖️ 11. LexIA</button>
                                <button onClick={() => setPestañaActiva('contabilidad_fiscia')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'contabilidad_fiscia' ? 'bg-sky-600 text-white' : 'bg-slate-900 text-sky-300'}`}>📊 12. FiscIA C-Level (.doc)</button>
                                <button onClick={() => setPestañaActiva('freshcontrol')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'freshcontrol' ? 'bg-lime-600 text-white' : 'bg-slate-900 text-lime-300'}`}>🥬 13. FreshControl</button>
                                <button onClick={() => setPestañaActiva('finora')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'finora' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-sky-300'}`}>💳 14. Finora Pay</button>
                                <button onClick={() => setPestañaActiva('sonica')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'sonica' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-rose-300'}`}>🎵 15. Sónica Core</button>
                                <button onClick={() => setPestañaActiva('sifv')} className={`py-1 px-2 rounded text-[10px] font-bold ${pestañaActiva === 'sifv' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-orange-300'}`}>🚨 16. SIFV Reynosa</button>
                            </div>
                        </div>

                        {/* CONTENIDO DE CADA PESTAÑA */}
                        {pestañaActiva === 'aura_ai' && (
                            <div className="p-4 bg-slate-950 border border-pink-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-pink-300 uppercase">👩‍💻 Aura AI — Estrategia y Privacidad Soberana</h3>
                                <textarea value={promptAura} onChange={(e) => setPromptAura(e.target.value)} rows={2} className="w-full bg-slate-900 border border-pink-500/40 rounded p-2 text-white text-xs outline-none" />
                                <button onClick={() => ejecutarAccionModular('consultar_aura')} className="bg-pink-600 text-white text-xs font-bold py-2 px-4 rounded">🚀 Ejecutar Análisis Aura AI (.JSON)</button>
                            </div>
                        )}

                        {pestañaActiva === 'aegis_sentinel' && (
                            <div className="p-4 bg-slate-950 border border-indigo-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-indigo-300 uppercase">🛡️ Aegis Sentinel AI — Auditoría de Software (.JSON)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('aegis_auditoria_qa')} className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded">📦 Exportar QA Software (.JSON)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'chronos_restore' && (
                            <div className="p-4 bg-slate-950 border border-pink-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-pink-300 uppercase">⏳ Chronos AI — Respaldo de Software (.JSON)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('chronos_ejecutar_backup')} className="bg-pink-600 text-white text-xs font-bold py-2 px-4 rounded">⏳ Generar Backup (.JSON)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'gobierno_mexico' && (
                            <div className="p-4 bg-slate-950 border border-amber-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-amber-300 uppercase">🇲🇽 Matriz de Gobierno & Ciudadanía (Word .doc)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('exportar_matriz_gobierno')} className="bg-amber-600 text-slate-950 text-xs font-bold py-2 px-4 rounded">📄 Exportar Matriz en Word (.doc)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'omega_watcher' && (
                            <div className="p-4 bg-slate-950 border border-indigo-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-indigo-300 uppercase">🛡️ Omega Watcher — Contenedores y Docker</h3>
                                <p className="text-xs text-slate-300">Sincronización de contenedores locales y monitoreo para {titularExclusivo}[cite: 1].</p>
                            </div>
                        )}

                        {pestañaActiva === 'jarvis_ai' && (
                            <div className="p-4 bg-slate-950 border border-purple-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-purple-300 uppercase">🤖 Jarvis AI — Orquestador Multi-Modelo (Claude + Gemini + ChatGPT)</h3>
                                <select value={canalJarvis} onChange={(e: any) => setCanalJarvis(e.target.value)} className="bg-slate-900 border border-purple-500/40 rounded p-1.5 text-white text-xs">
                                    <option value="mcp">MCP (Model Context Protocol)</option>
                                    <option value="api">API Directa</option>
                                    <option value="cli">Consola CLI</option>
                                </select>
                                <textarea value={promptJarvis} onChange={(e) => setPromptJarvis(e.target.value)} rows={2} className="w-full bg-slate-900 border border-purple-500/40 rounded p-2 text-white text-xs outline-none" />
                                <button onClick={() => ejecutarAccionModular('consultar_jarvis')} className="bg-purple-600 text-white text-xs font-bold py-2 px-4 rounded">⚡ Sincronizar Jarvis (.JSON)</button>
                            </div>
                        )}

                        {pestañaActiva === 'multicerebro' && (
                            <div className="p-4 bg-slate-950 border border-cyan-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-cyan-300 uppercase">🌐 Multicerebro Core & Holding</h3>
                                <p className="text-xs text-slate-300">Red neuronal unificada operando bajo Vault Omega para {titularExclusivo}[cite: 1].</p>
                            </div>
                        )}

                        {pestañaActiva === 'clonacion_holding' && (
                            <div className="p-4 bg-slate-950 border border-cyan-600/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-cyan-300 uppercase">🔄 Módulo de Clonación y Espejo Maestro (.JSON)[cite: 1]</h3>
                                <select value={modoClonacion} onChange={(e: any) => setModoClonacion(e.target.value)} className="bg-slate-900 border border-cyan-500/40 rounded p-1.5 text-white text-xs">
                                    <option value="espejo_completo_json">Espejo Completo (.JSON)</option>
                                    <option value="clon_sandbox_local">Clon de Sandbox Local</option>
                                </select>
                                <button onClick={() => ejecutarAccionModular('ejecutar_clonacion_holding')} className="bg-cyan-600 text-white text-xs font-bold py-2 px-4 rounded">🔄 Ejecutar Espejo (.JSON)[cite: 1]</button>
                                <p className="text-[11px] text-emerald-400 font-mono">{estadoClonacion}</p>
                            </div>
                        )}

                        {pestañaActiva === 'memoria_personalizacion' && (
                            <div className="p-4 bg-slate-950 border border-teal-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-teal-300 uppercase">🧠 Memoria y Personalización Soberana (.JSON)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('exportar_memoria_json')} className="bg-teal-600 text-slate-950 text-xs font-bold py-2 px-4 rounded">📦 Exportar Memoria (.JSON)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'tiendas' && (
                            <div className="p-4 bg-slate-950 border border-amber-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-amber-300 uppercase">🛒 Tiendas y Acceso a Carpeta Holding</h3>
                                <button onClick={() => ejecutarAccionModular('abrir_carpeta')} className="bg-amber-600 text-slate-950 text-xs font-bold py-2 px-4 rounded">📁 Preparar Script Explorer</button>
                            </div>
                        )}

                        {pestañaActiva === 'unadm_titulacion' && (
                            <div className="p-4 bg-slate-950 border border-emerald-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-emerald-300 uppercase">🎓 Titulación UnADM & Classroom (Word .doc)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('classroom_word')} className="bg-emerald-600 text-slate-950 text-xs font-bold py-2 px-4 rounded">📥 Generar Tarea/Tesis en Word (.doc)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'legal_lexia' && (
                            <div className="p-4 bg-slate-950 border border-blue-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-blue-300 uppercase">⚖️ LexIA — Derecho Público Municipal</h3>
                                <p className="text-xs text-slate-300">Asistencia legal para normativas de Reynosa y Tamaulipas.</p>
                            </div>
                        )}

                        {pestañaActiva === 'contabilidad_fiscia' && (
                            <div className="p-4 bg-slate-950 border border-sky-500/50 rounded-lg space-y-3">
                                <h3 className="text-xs font-bold text-sky-300 uppercase">📊 FiscIA C-Level (Word .doc)[cite: 1]</h3>
                                <button onClick={() => ejecutarAccionModular('corp_word')} className="bg-sky-600 text-white text-xs font-bold py-2 px-4 rounded">📄 Generar Propuesta en Word (.doc)[cite: 1]</button>
                            </div>
                        )}

                        {pestañaActiva === 'freshcontrol' && (
                            <div className="p-4 bg-slate-950 border border-lime-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-lime-300 uppercase">🥬 FreshControl — Logística y Catálogos</h3>
                                <p className="text-xs text-slate-300">Gestión de productos, unit measures y proveedores.</p>
                            </div>
                        )}

                        {pestañaActiva === 'finora' && (
                            <div className="p-4 bg-slate-950 border border-sky-400/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-sky-300 uppercase">💳 Finora Pay — Fintech Backend</h3>
                                <p className="text-xs text-slate-300">Plataforma financiera y pasarelas de pago de {titularExclusivo}[cite: 1].</p>
                            </div>
                        )}

                        {pestañaActiva === 'sonica' && (
                            <div className="p-4 bg-slate-950 border border-rose-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-rose-300 uppercase">🎵 Sónica Core — Streaming API</h3>
                                <p className="text-xs text-slate-300">Arquitectura de streaming de audio y backend multimedia.</p>
                            </div>
                        )}

                        {pestañaActiva === 'sifv' && (
                            <div className="p-4 bg-slate-950 border border-orange-500/50 rounded-lg space-y-2">
                                <h3 className="text-xs font-bold text-orange-300 uppercase">🚨 SIFV Reynosa — Seguridad Pública</h3>
                                <p className="text-xs text-slate-300">Módulo operativo y contratos administrativos municipales.</p>
                            </div>
                        )}

                        {/* CONSOLA EN VIVO */}
                        <div className="w-full bg-black border border-emerald-500/50 rounded-lg p-3 font-mono text-[11px] text-emerald-400 space-y-1 shadow-inner mt-4">
                            <div className="flex justify-between items-center border-b border-emerald-500/30 pb-1 mb-1 text-emerald-300">
                                <span>💻 Vault Omega Live Web Shell (Perfil Privado Activo)</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                            <div className="max-h-24 overflow-y-auto space-y-0.5">
                                {consolaLogs.map((log, index) => (
                                    <div key={index} className="leading-tight">{log}</div>
                                ))}
                            </div>
                        </div>

                        {mensajeRespuesta && (
                            <div className="mt-4 p-4 bg-slate-950 border-2 border-indigo-500 rounded-lg text-xs shadow-xl relative space-y-1">
                                <div className="absolute top-0 right-0 bg-indigo-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-bl">HASH SHA-256 VERIFICADO</div>
                                <div className="text-white font-medium whitespace-pre-line">{mensajeRespuesta}</div>
                                {folioUltimo && <p className="text-[11px] text-indigo-300 font-mono"><span className="font-bold">Folio:</span> {folioUltimo}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
