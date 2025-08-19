import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/list/page1')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/list/page1"!</div>
}
