# 🍣 Sushi POS Frontend

Sistema de Punto de Venta (POS) completo para restaurantes de sushi, desarrollado con Next.js 15.5.5 y TypeScript.

## 🚀 Características Principales

### 🔐 Autenticación y Usuarios
- **Sistema de login/signup** completo
- **Gestión de usuarios** (solo administradores)
- **Roles diferenciados**: Administrador y Mesero
- **Autenticación JWT** segura

### 📦 Gestión de Productos
- **CRUD completo** de productos
- **Subida de imágenes** con Cloudinary
- **Categorías de productos**
- **Control de stock** en tiempo real
- **Preview de imágenes** antes de subir

### 🛒 Punto de Venta (POS)
- **Interfaz intuitiva** con imágenes de productos
- **Carrito de compras** dinámico
- **Cálculo automático** de totales
- **Gestión de mesas** y notas especiales

### 📋 Gestión de Órdenes
- **Flujo completo**: Pendiente → En Cocina → Lista → Pagada
- **Estados visuales** con badges coloridos
- **Detalles completos** de cada orden
- **Cancelación de órdenes** (solo pendientes/en cocina)

### 💰 Sistema de Pagos
- **Pago en efectivo** (funcional)
- **Pago con tarjeta** (temporalmente deshabilitado)
- **Pago digital** (temporalmente deshabilitado)
- **Cálculo de cambio** automático

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.5.5** con Turbopack
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Radix UI** para componentes
- **Axios** para peticiones HTTP

### Backend Integration
- **API REST** con autenticación JWT
- **Cloudinary** para gestión de imágenes
- **Stripe** (preparado para implementación)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── dashboard/          # Dashboard principal
│   ├── login/             # Página de login
│   ├── signup/            # Página de registro
│   ├── products/          # Gestión de productos
│   ├── orders/            # Gestión de órdenes
│   ├── pos/               # Punto de venta
│   └── users/             # Gestión de usuarios
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   └── SystemStatus.tsx  # Estado del sistema
├── contexts/             # Contextos de React
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuración
├── services/             # Servicios de API
└── types/                # Definiciones de TypeScript
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Cloudinary (para imágenes)

### 1. Clonar el repositorio
```bash
git clone https://github.com/FLAranoHerrera/sushi-pos-frontend.git
cd sushi-pos-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:
```env
NEXT_PUBLIC_API_URL=https://sushi-pos-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_key_aqui
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Construcción para producción
npm run start        # Ejecutar en producción
npm run lint         # Linter de código
```

## 🎨 Características de UI/UX

### Diseño Responsivo
- **Mobile-first** approach
- **Grid adaptativo** para diferentes pantallas
- **Componentes flexibles** que se adaptan al contenido

### Experiencia de Usuario
- **Navegación intuitiva** con breadcrumbs
- **Estados de carga** visuales
- **Confirmaciones** para acciones destructivas
- **Feedback inmediato** en todas las acciones

### Accesibilidad
- **Contraste adecuado** en todos los elementos
- **Navegación por teclado** completa
- **Etiquetas semánticas** apropiadas

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Validación de roles** en el frontend
- **Sanitización** de inputs del usuario
- **Headers de seguridad** configurados

## 📱 Funcionalidades por Rol

### 👑 Administrador
- ✅ Gestión completa de usuarios
- ✅ Gestión de productos
- ✅ Gestión de órdenes
- ✅ Acceso al POS
- ✅ Estadísticas del sistema

### 🍽️ Mesero
- ✅ Acceso al POS
- ✅ Gestión de órdenes
- ✅ Procesamiento de pagos

## 🚧 Estado del Proyecto

### ✅ Completado
- [x] Sistema de autenticación
- [x] Gestión de usuarios
- [x] Gestión de productos con imágenes
- [x] Punto de venta completo
- [x] Gestión de órdenes
- [x] Pagos en efectivo
- [x] Interfaz responsiva

### 🔄 En Desarrollo
- [ ] Integración completa con Stripe
- [ ] Reportes y analytics
- [ ] Notificaciones en tiempo real
- [ ] Modo offline

### 📋 Próximas Características
- [ ] Integración con impresoras
- [ ] Módulo de inventario
- [ ] Reportes financieros
- [ ] API para aplicaciones móviles

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta a:
- **Email**: [tu-email@ejemplo.com]
- **GitHub Issues**: [Crear un issue](https://github.com/FLAranoHerrera/sushi-pos-frontend/issues)

## 🙏 Agradecimientos

- **Next.js** por el framework increíble
- **Tailwind CSS** por el sistema de diseño
- **Radix UI** por los componentes accesibles
- **Cloudinary** por el servicio de imágenes
- **Vercel** por la plataforma de deployment

---

**Desarrollado con ❤️ para restaurantes de sushi**