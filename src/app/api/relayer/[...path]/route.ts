import { NextRequest, NextResponse } from "next/server";

/**
 * Relayer URLs routed by chainId.
 * Both Sepolia and Ethereum mainnet are proxied through this backend endpoint —
 * this keeps relayer API keys server-side only (never exposed to the client).
 * Parity with ShadowLine's stated security posture.
 */
const RELAYER_URLS: Record<string, string> = {
  "11155111": "https://relayer.testnet.zama.org/v2",
  // Mainnet relayer — will be activated when API key is provisioned.
  // Set NEXT_PUBLIC_MAINNET_RELAYER_URL env var or update this fallback.
  "1": process.env.MAINNET_RELAYER_URL ?? "https://relayer.mainnet.zama.org/v2",
};

async function proxyRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  const segments = url.pathname.replace("/api/relayer/", "").split("/");
  const chainId = segments[0];
  const restPath = segments.slice(1).join("/");

  if (!chainId) {
    return NextResponse.json({ error: "Missing chainId" }, { status: 400 });
  }

  const upstream = RELAYER_URLS[chainId];
  if (!upstream) {
    return NextResponse.json({ error: `Unsupported chain ${chainId}` }, { status: 400 });
  }

  try {
    const base = upstream.replace(/\/$/, "");
    const upstreamUrl = new URL(restPath ? `${base}/${restPath}` : base);
    url.searchParams.forEach((v, k) => upstreamUrl.searchParams.set(k, v));

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": request.headers.get("Content-Type") ?? "application/json",
        "Accept": request.headers.get("Accept") ?? "application/json",
      },
    };

    if (method !== "GET" && method !== "HEAD") {
      fetchOptions.body = await request.text();
    }

    const res = await fetch(upstreamUrl.toString(), fetchOptions);
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Relayer proxy error" }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, "PUT");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    },
  });
}
