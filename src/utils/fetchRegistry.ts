export default async function fetchRegistry(endpoint: string, method: string = "GET", body: Record<string, unknown> | null = null): Promise<any> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_CFCE_REGISTRY_API_KEY}`, //replace with your API key
  }

  console.log({ headers, body, endpoint, method, base: process.env.EXPO_PUBLIC_CFCE_REGISTRY_URI })
  return;
  const response = await fetch(`${process.env.EXPO_PUBLIC_CFCE_REGISTRY_URI}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  }).catch(console.error);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
