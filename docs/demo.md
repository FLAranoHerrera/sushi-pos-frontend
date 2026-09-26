# Demo frontend para entrevistas

Abrir `/demo`. No requiere registro, variables de Stripe ni acceso al backend.
Los datos son ficticios y viven en memoria. Recargar o reiniciar devuelve el estado inicial.
No se almacena información de clientes y ningún botón realiza cobros reales.

## Recorrido de 3 minutos

1. Buscar ramen, añadir dos unidades y comprobar el total.
2. Activar el error recuperable y crear una orden. La selección se conserva; reintentar.
3. Revisar la orden pendiente y la reducción de inventario.
4. Cancelarla y comprobar la devolución de existencias.
5. Crear otra orden y simular el cobro; comprobar que ya no se puede cancelar.
6. Buscar un producto inexistente y revisar el estado vacío. Repetir en móvil.

## Alcance verificable

La demo muestra frontend, validaciones y estados de interacción. No demuestra una transacción contra PostgreSQL, conexión en vivo con NestJS ni integración real con Stripe. Esas propiedades se verifican por separado en el backend y sus pruebas de integración.

Pruebas: `npm run test:demo`. Compilación: `npm run build`.
