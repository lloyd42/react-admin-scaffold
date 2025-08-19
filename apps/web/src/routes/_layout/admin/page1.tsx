import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/admin/page1')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/admin/page1"!</div>
}
