export async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit & { timeout?: number }, timeout = 15000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), init?.timeout ?? timeout)
  try {
    const res = await fetch(input, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}
