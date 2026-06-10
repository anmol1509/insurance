import { ProxyAgent, fetch as undiciFetch } from 'undici'

let dispatcher: ProxyAgent | undefined

function getDispatcher(): ProxyAgent | undefined {
  const fixieUrl = process.env.FIXIE_URL
  if (!fixieUrl) return undefined
  if (!dispatcher) dispatcher = new ProxyAgent(fixieUrl)
  return dispatcher
}

export function proxyFetch(url: string, init?: RequestInit): Promise<Response> {
  const d = getDispatcher()
  if (!d) return fetch(url, init)
  return undiciFetch(url, { ...init, dispatcher: d } as any) as unknown as Promise<Response>
}
