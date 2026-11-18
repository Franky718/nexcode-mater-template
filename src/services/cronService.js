const cron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');

const transporteremail = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.holding-nexcode.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

cron.schedule('0 0 1 * *', async () => {
    console.log('⏰ [Cron Job] Iniciando ciclo de facturación y reportes mensuales...');
    const rutaPdf = path.join(__dirname, '../../outputs/reporte_mensual.pdf');
    try {
        await transporteremail.sendMail({
            from: `"Nexcode Automation" <${process.env.EMAIL_USER}>`,
            to: 'direccion@holding-nexcode.com',
            subject: '📋 Reporte de Recaudación Mensual Consolidado - NEXCODE',
            text: 'Adjunto encontrará el reporte fiscalizado correspondiente al cierre del mes.',
            attachments: [{ filename: 'reporte_mensual.pdf', path: rutaPdf }]
        });
        console.log('📧 [Cron Job] Reportes distribuidos de forma exitosa.');
    } catch (error) {
        console.error('❌ Error crítico en la ejecución del ciclo mensual:', error.message);
    }
});

module.exports = {};
