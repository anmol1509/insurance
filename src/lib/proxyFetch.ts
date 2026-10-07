import { FormData as UndiciFormData, ProxyAgent, fetch as undiciFetch } from 'undici'

let dispatcher: ProxyAgent | undefined

function getDispatcher(): ProxyAgent | undefined {
  const fixieUrl = process.env.FIXIE_URL
  if (!fixieUrl) return undefined
  if (!dispatcher) dispatcher = new ProxyAgent(fixieUrl)
  return dispatcher
}

/**
 * The `undici` package's `fetch` doesn't recognise the runtime's own
 * `FormData` class, so a multipart body (a photo upload) would go out as the
 * text "[object FormData]" and the receiver would see none of its fields —
 * Cloudinary answered "Upload preset must be specified". Re-build the body
 * with undici's own `FormData` before handing it over.
 */
function toUndiciBody(body: RequestInit['body']): RequestInit['body'] | UndiciFormData {
  if (typeof FormData === 'undefined' || !(body instanceof FormData)) return body
  const converted = new UndiciFormData()
  for (const [name, value] of body.entries()) {
    if (typeof value === 'string') converted.append(name, value)
    else converted.append(name, value, value.name)
  }
  return converted
}

/** `fetch`, routed through the FIXIE_URL proxy when one is configured. */
export function proxyFetch(url: string, init?: RequestInit): Promise<Response> {
  const d = getDispatcher()
  if (!d) return fetch(url, init)
  type UndiciInit = NonNullable<Parameters<typeof undiciFetch>[1]>
  const proxied = { ...init, body: toUndiciBody(init?.body), dispatcher: d } as unknown as UndiciInit
  return undiciFetch(url, proxied) as unknown as Promise<Response>
}
