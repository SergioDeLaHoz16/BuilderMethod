const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Configuración del cliente Supabase
 * Utiliza variables de entorno para las credenciales
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
