import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM =
  process.env.GRAPHQL_UPSTREAM_URL ||
  "https://apimovogo.persistatechnology.com/graphql";

async function proxy(req: NextRequest) {
  const body = await req.text();
  const authorization = req.headers.get("authorization");

  // Server-side fetch — do NOT forward browser Origin (prod CORS would block it)
  const upstream = await fetch(UPSTREAM, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(authorization ? { authorization } : {}),
    },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    return await proxy(req);
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json(
      { errors: [{ message: "GraphQL proxy failed" }] },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    upstream: UPSTREAM,
  });
}
