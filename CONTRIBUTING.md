# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Sushi POS Frontend! Esta guía te ayudará a entender cómo contribuir de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Issues](#reportar-issues)

## 📜 Código de Conducta

Este proyecto sigue un código de conducta que esperamos que todos los contribuidores sigan:

- **Sé respetuoso** con otros contribuidores
- **Sé constructivo** en tus comentarios
- **Sé paciente** con los nuevos contribuidores
- **Sé profesional** en todas las interacciones

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork localmente
git clone https://github.com/tu-usuario/sushi-pos-frontend.git
cd sushi-pos-frontend
```

### 2. Configurar el Remote

```bash
# Agregar el repositorio original como upstream
git remote add upstream https://github.com/FLAranoHerrera/sushi-pos-frontend.git

# Verificar remotes
git remote -v
```

### 3. Crear una Rama

```bash
# Crear y cambiar a una nueva rama
git checkout -b feature/nombre-de-tu-feature

# O para bugfixes
git checkout -b fix/descripcion-del-bug
```

## 🛠️ Configuración del Entorno

### Prerrequisitos

- **Node.js 18+**
- **npm** o **yarn**
- **Git**

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno Necesarias

```env
# Mínimo requerido para desarrollo
NEXT_PUBLIC_API_URL=https://sushi-pos-backend.onrender.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Opcional para funcionalidades completas
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

## 📝 Convenciones de Código

### TypeScript

- **Usa tipos estrictos** - Evita `any`
- **Define interfaces** para objetos complejos
- **Usa enums** para valores constantes
- **Documenta funciones** con JSDoc

```typescript
// ✅ Bueno
interface User {
  id: string
  name: string
  email: string
}

// ❌ Evitar
const user: any = {}
```

### React

- **Usa hooks** en lugar de clases
- **Memoiza componentes** pesados con React.memo
- **Usa useCallback** para funciones en dependencias
- **Usa useMemo** para cálculos costosos

```typescript
// ✅ Bueno
const ProductCard = React.memo(({ product }: { product: Product }) => {
  const handleClick = useCallback(() => {
    // lógica
  }, [])
  
  return <div>...</div>
})

// ❌ Evitar
const ProductCard = ({ product }) => {
  const handleClick = () => {
    // lógica
  }
  return <div>...</div>
}
```

### Estilos

- **Usa Tailwind CSS** para estilos
- **Sigue el sistema de diseño** establecido
- **Usa clases semánticas** y consistentes
- **Evita estilos inline** cuando sea posible

```tsx
// ✅ Bueno
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ❌ Evitar
<div style={{ display: 'flex', padding: '16px' }}>
```

### Estructura de Archivos

```
src/
├── app/                    # Páginas (App Router)
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base
│   └── [Feature].tsx     # Componentes específicos
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades
├── services/             # Servicios de API
└── types/                # Definiciones TypeScript
```

### Naming Conventions

- **Componentes**: PascalCase (`ProductCard`)
- **Hooks**: camelCase con prefijo `use` (`useProducts`)
- **Funciones**: camelCase (`handleSubmit`)
- **Variables**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)

## 🔄 Proceso de Pull Request

### 1. Mantener tu Fork Actualizado

```bash
# Obtener cambios del upstream
git fetch upstream

# Cambiar a main
git checkout main

# Mergear cambios
git merge upstream/main

# Push a tu fork
git push origin main
```

### 2. Crear tu Feature

```bash
# Crear rama desde main actualizada
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push a tu fork
git push origin feature/nueva-funcionalidad
```

### 3. Crear Pull Request

- **Título descriptivo**: `feat: agregar filtro por fecha en asistencia`
- **Descripción detallada**: Explica qué hace el PR
- **Referencia issues**: `Fixes #123`
- **Screenshots**: Si aplica, incluye capturas

### 4. Template de Pull Request

```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ✅ Checklist
- [ ] Código sigue las convenciones del proyecto
- [ ] Self-review del código realizado
- [ ] Comentarios añadidos para código complejo
- [ ] Documentación actualizada
- [ ] No hay warnings nuevos

## 🧪 Testing
Describe las pruebas realizadas.

## 📸 Screenshots
Si aplica, incluye capturas de pantalla.
```

## 🐛 Reportar Issues

### Antes de Reportar

1. **Busca issues existentes** - Evita duplicados
2. **Verifica la versión** - Asegúrate de usar la última
3. **Revisa la documentación** - Puede que ya esté documentado

### Template de Issue

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ve el error

## 🎯 Comportamiento Esperado
Descripción de lo que debería pasar.

## 📸 Screenshots
Si aplica, incluye capturas de pantalla.

## 🖥️ Información del Sistema
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Versión: [e.g. 1.0.0]

## 📋 Contexto Adicional
Cualquier otra información relevante.
```

## 🏷️ Tipos de Commits

Usa el formato de commits convencionales:

```bash
# Features
git commit -m "feat: agregar filtro por fecha en asistencia"

# Bug fixes
git commit -m "fix: corregir error de validación en formulario"

# Documentation
git commit -m "docs: actualizar README con nuevas funcionalidades"

# Style
git commit -m "style: mejorar espaciado en componentes"

# Refactor
git commit -m "refactor: optimizar componente ProductCard"

# Test
git commit -m "test: agregar tests para hook useProducts"

# Chore
git commit -m "chore: actualizar dependencias"
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Escribir Tests

```typescript
// Ejemplo de test para componente
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  it('should render product information', () => {
    const product = {
      id: '1',
      name: 'Sushi Roll',
      price: 15.99
    }
    
    render(<ProductCard product={product} onAddToCart={jest.fn()} />)
    
    expect(screen.getByText('Sushi Roll')).toBeInTheDocument()
    expect(screen.getByText('$15.99')).toBeInTheDocument()
  })
})
```

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## ❓ Preguntas Frecuentes

### ¿Cómo empiezo a contribuir?
1. Fork el repositorio
2. Clona tu fork
3. Crea una rama para tu feature
4. Haz tus cambios
5. Crea un Pull Request

### ¿Qué tipo de contribuciones necesitas?
- **Bug fixes** - Corrección de errores
- **Features** - Nuevas funcionalidades
- **Documentación** - Mejorar docs
- **Tests** - Añadir cobertura de tests
- **Performance** - Optimizaciones

### ¿Cómo reporto un bug?
Usa el template de issue y proporciona toda la información posible.

## 📞 Contacto

Si tienes preguntas sobre contribución:

- **Email**: [aranoherrera92@gmail.com](mailto:aranoherrera92@gmail.com)
- **GitHub Issues**: [Crear issue](https://github.com/FLAranoHerrera/sushi-pos-frontend/issues)

---

**¡Gracias por contribuir al proyecto! 🎉**
