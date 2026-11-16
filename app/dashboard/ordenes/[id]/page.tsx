import OrdenDetalle from './OrdenDetalle'

export const dynamicParams = false

export async function generateStaticParams() {
  // Las órdenes se cargan dinámicamente en el cliente via API
  // Retornamos array vacío para que la ruta se genere como shell estático
  return [{ id: '0' }]
}

export default function OrdenDetallePage() {
  return <OrdenDetalle />
}
