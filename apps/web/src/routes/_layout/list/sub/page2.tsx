import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/list/sub/page2')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/list/sub/page2"!</div>
}
