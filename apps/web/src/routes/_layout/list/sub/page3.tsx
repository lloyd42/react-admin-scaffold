import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/list/sub/page3')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/list/sub/page3"!</div>
}
