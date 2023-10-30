import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const reqPath = `${req.nextUrl.pathname}`.replaceAll(
        "/api/backapi/",
        "",
    );
    const params = url.searchParams;
    const fetchOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.get('Authorization') || '',
        }
    }
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${reqPath}?${params}`,fetchOptions
        );

        const json = await response.json();

        return NextResponse.json(json);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}


export async function POST(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const reqPath = `${req.nextUrl.pathname}`.replaceAll(
        "/api/backapi/",
        "",
    );
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
    }
    console.log(fetchOptions.body)
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${reqPath}?${params}`,fetchOptions
        );

        const json = await response.json();

        return NextResponse.json(json);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}