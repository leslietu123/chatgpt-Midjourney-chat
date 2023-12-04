import { NextRequest, NextResponse } from "next/server";

async function forwardRequest(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const reqPath = `${req.nextUrl.pathname}`.replaceAll("/api/translate/", "");
    const params = url.searchParams;

    const fetchOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.get('Authorization') || '',
        },
        method: req.method,
        cache: "no-store",
        body: req.body,
        //@ts-ignore
        duplex: "half",
    };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BAIDU_TRANS_URL}/${reqPath}?${params}`,
            fetchOptions
        );

        const json = await response.json();

        return NextResponse.json(json);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    return forwardRequest(req, res);
}

export async function POST(req: NextRequest, res: NextResponse) {
    return forwardRequest(req, res);
}

export async function DELETE(req: NextRequest, res: NextResponse) {
    return forwardRequest(req, res);
}

export async function PUT(req: NextRequest, res: NextResponse) {
    return forwardRequest(req, res);
}

export async function PATCH(req: NextRequest, res: NextResponse) {
    return forwardRequest(req, res);
}
