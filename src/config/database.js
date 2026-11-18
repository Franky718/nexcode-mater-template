const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const provider = process.env.DATABASE_PROVIDER || 'local';
let dbClient = null;

async function inicializarBaseDeDatos() {
    console.log(`🔄 [Database] Inicializando proveedor en la nube: [${provider.toUpperCase()}]...`);
    try {
        if (provider === 'cloud_supabase') {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_ANON_KEY;
            if (!supabaseUrl || !supabaseKey) throw new Error("Faltan credenciales de Supabase en el archivo .env");
            dbClient = createClient(supabaseUrl, supabaseKey);
            console.log('✅ [Database] Cliente Supabase en la nube conectado correctamente.');
            return { type: 'supabase', client: dbClient };
        } else if (provider === 'cloud_mysql' || provider === 'local') {
            const connectionString = provider === 'cloud_mysql' 
                ? process.env.REMOTE_DB_URL 
                : {
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT || 3306
                  };
            const pool = mysql.createPool(connectionString);
            const connection = await pool.getConnection();
            console.log(`✅ [Database] Conexión exitosa al pool MySQL [${provider.toUpperCase()}].`);
            connection.release();
            return { type: 'mysql', client: pool };
        }
    } catch (error) {
        console.error('❌ [Database Error] Falló la inicialización de la infraestructura:', error.message);
        process.exit(1);
    }
}

module.exports = { inicializarBaseDeDatos, getClient: () => dbClient };
