# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar el proyecto Sushi POS Frontend en Vercel.

## 📋 Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub (ya configurado)
- Backend desplegado (ya configurado en Render)

## 🔧 Configuración en Vercel

### 1. Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `sushi-pos-frontend`
5. Haz clic en "Import"

### 2. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```env
NEXT_PUBLIC_API_URL=https://sushi-pos-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_key_aqui
```

### 3. Configuración del Build

Vercel detectará automáticamente que es un proyecto Next.js y usará:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Dominio Personalizado (Opcional)

1. Ve a **Settings > Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

## 🔒 Configuración de Seguridad

### Headers de Seguridad
El proyecto ya incluye headers de seguridad configurados:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

### CORS
El backend debe estar configurado para aceptar requests desde tu dominio de Vercel.

## 📊 Monitoreo y Analytics

### Vercel Analytics
1. Ve a **Analytics** en el dashboard
2. Habilita Vercel Analytics para monitorear el rendimiento

### Logs
- Ve a **Functions** para ver logs de las funciones serverless
- Usa **Speed Insights** para monitorear Core Web Vitals

## 🚀 Deployment Automático

Una vez configurado:
- Cada push a la rama `main` desplegará automáticamente
- Los pull requests crearán preview deployments
- Los deployments se pueden revertir desde el dashboard

## 🔧 Configuración Avanzada

### Optimizaciones de Build
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### Configuración de Edge Functions (Opcional)
Si necesitas edge functions, agrega en `vercel.json`:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🐛 Troubleshooting

### Error de Build
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que el backend esté funcionando

### Error de CORS
- Configura el backend para aceptar el dominio de Vercel
- Verifica que `NEXT_PUBLIC_API_URL` esté correctamente configurada

### Error de Imágenes
- Verifica que los dominios estén configurados en `next.config.ts`
- Asegúrate de que Cloudinary esté funcionando

## 📈 Optimizaciones de Producción

### Performance
- ✅ Compresión habilitada
- ✅ Optimización de CSS
- ✅ Headers de seguridad
- ✅ Optimización de imágenes

### SEO
- ✅ Meta tags configurados
- ✅ Sitemap automático
- ✅ Robots.txt incluido

## 🔄 CI/CD

### GitHub Actions (Opcional)
Puedes agregar GitHub Actions para:
- Tests automáticos
- Linting
- Security scanning

### Preview Deployments
- Cada PR crea un preview deployment
- URLs únicas para cada preview
- Fácil testing antes de merge

## 📞 Soporte

Si tienes problemas con el deployment:
1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Asegúrate de que el backend esté funcionando
4. Contacta: aranoherrera92@gmail.com

---

**¡Tu aplicación estará disponible en https://tu-proyecto.vercel.app!** 🎉
