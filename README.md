# Sushi POS Frontend

Proyecto de punto de venta con Next.js, React y TypeScript.

## Demo para entrevistas

Abrir `/demo` para explorar catálogo, búsqueda, inventario, creación de órdenes, cancelación y cobro simulado. No requiere registro ni claves, usa datos ficticios en memoria y no llama al backend. Incluye estados vacíos, de carga y de error recuperable, además de diseño adaptable a móvil.

[Guion de demostración y alcance](docs/demo.md)

```sh
npm ci
npm run test:demo
npm run build
npm run dev
```

El resto de las pantallas conserva la integración con la API configurada en `NEXT_PUBLIC_API_URL`. La demo independiente no acredita la conexión extremo a extremo de esos módulos ni una integración productiva de pagos.

## Desarrollo local

Usa Node.js 22. Para conectar las pantallas de la aplicación al backend, configura `NEXT_PUBLIC_API_URL` en `.env.local`. Revisa `.env.example` para las demás variables. No incluyas claves privadas en variables públicas de Next.js.

```sh
npm run dev
```

Abre la dirección que muestra el servidor y añade `/demo` para la demostración independiente.

## Estructura

- `src/app/demo`: interfaz de demostración.
- `src/lib/demo.ts`: reglas de inventario, carrito y órdenes de la demo.
- `tests/demo.test.mjs`: pruebas de comportamiento de esas reglas.
- `src/app`: pantallas de autenticación, productos, órdenes, POS y asistencia.
- `src/services`: clientes de la API.

## Validación y límites

`npm run test:demo` comprueba creación de órdenes, stock insuficiente, cancelación y estados de pago. `npm run build` comprueba compilación y tipos. La revisión manual de la demo incluye búsqueda sin resultados, error recuperable y pantalla móvil.

Los cobros de `/demo` son simulados y no se conservan al recargar. La aplicación conectada requiere su backend y servicios externos. No se presenta como un sistema listo para operar un restaurante; quedan pendientes validaciones completas de permisos, pagos externos y despliegue. No se han medido disponibilidad, puntuaciones de rendimiento ni conformidad integral de accesibilidad.

La ruta pública `/demo` estará disponible después de integrar y desplegar estos cambios.
