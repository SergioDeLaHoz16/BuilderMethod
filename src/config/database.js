const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Configuración del cliente Supabase
 * Utiliza variables de entorno para las credenciales
 *
 * Variables requeridas en .env:
 * - SUPABASE_URL: URL de tu proyecto Supabase
 * - SUPABASE_ANON_KEY: Clave anónima de Supabase
 */

// Validar que existan las variables de entorno necesarias
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    'Faltan variables de entorno requeridas: SUPABASE_URL y SUPABASE_ANON_KEY'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
