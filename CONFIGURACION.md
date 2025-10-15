# 🍣 Configuración del Frontend Sushi POS

## 📋 Configuración Completada

### ✅ Variables de Entorno Configuradas

**Archivo `.env.local` (desarrollo):**
```env
NEXT_PUBLIC_API_URL=https://sushi-pos-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**Archivo `.env.example` (plantilla):**
- Incluye todas las variables necesarias
- Instrucciones para desarrollo y producción

### ✅ Configuración de Next.js

**Archivo `next.config.ts` actualizado:**
- Variables de entorno expuestas
- Configuración de imágenes para el backend
- Dominios permitidos para imágenes

### ✅ API Client Configurado

**Archivo `src/lib/api.ts` actualizado:**
- URL base apunta al backend deployado
- Interceptores de autenticación configurados
- Manejo de errores 401

## 🚀 Comandos de Desarrollo

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend estará disponible en: http://localhost:3001
```

### Producción
```bash
# Construir para producción
npm run build

# Ejecutar en modo producción
npm start
```

## 🔧 Configuración por Entorno

### Desarrollo
- **Frontend:** `http://localhost:3001`
- **Backend:** `https://sushi-pos-backend.onrender.com/api`
- **Variables:** `.env.local`

### Producción
Para deployar en producción, actualiza las variables:

```env
NEXT_PUBLIC_API_URL=https://sushi-pos-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://tu-dominio-frontend.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_key_here
```

## 📡 Endpoints del Backend

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/signup` - Registro
- `GET /auth/profile` - Perfil del usuario

### Productos
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

### Órdenes
- `GET /orders` - Listar órdenes
- `POST /orders` - Crear orden
- `PATCH /orders/:id` - Actualizar orden
- `POST /orders/:id/payment` - Procesar pago

### Pagos
- `POST /payments/intent` - Crear intent de pago
- `POST /payments/cash` - Pago en efectivo
- `POST /payments/checkout-session` - Sesión de checkout

## 🔑 Configuración de Stripe

Para configurar Stripe, necesitas:

1. **Obtener las claves de Stripe:**
   - Clave pública (pk_test_... o pk_live_...)
   - Clave secreta (en el backend)

2. **Actualizar la variable:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
   ```

## 🐛 Solución de Problemas

### Error de CORS
Si hay problemas de CORS, verifica que el backend tenga configurado:
```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'https://tu-dominio-frontend.com'],
  credentials: true
}))
```

### Error de Autenticación
- Verifica que el token se esté guardando en localStorage
- Revisa que el backend esté devolviendo el token correctamente
- Verifica que los headers de autorización estén configurados

### Error de Imágenes
- Verifica que las imágenes estén siendo servidas desde el backend
- Revisa la configuración de `remotePatterns` en `next.config.ts`

## 📱 Funcionalidades Implementadas

- ✅ Autenticación (login/signup)
- ✅ Gestión de productos
- ✅ Gestión de órdenes
- ✅ Sistema de pagos (Stripe + efectivo)
- ✅ Dashboard administrativo
- ✅ POS (Point of Sale)
- ✅ Gestión de usuarios

## 🎯 Próximos Pasos

1. **Configurar Stripe:** Obtener y configurar las claves de Stripe
2. **Probar conexión:** Verificar que el frontend se conecte correctamente al backend
3. **Deployar frontend:** Configurar el deploy del frontend en producción
4. **Testing:** Probar todas las funcionalidades end-to-end
