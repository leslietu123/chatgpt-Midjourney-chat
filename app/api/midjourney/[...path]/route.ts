// import {NextRequest, NextResponse} from "next/server";
// import {MidjourneyApi} from "@/app/core/midjourney";
// import {auth} from "@/app/api/auth";
//
// const api = new MidjourneyApi()
//
// async function handle(req: NextRequest, {params}: { params: { path: string[] } }) {
//     const authResult = auth(req);
//     if (authResult.error) {
//         return NextResponse.json(authResult, {
//             status: 401,
//         });
//     }
//     if (!api.isStarted()) {
//         try {
//             await api.start()
//         } catch (e: any) {
//             return NextResponse.json({code: 1, status: 'FAIL', msg: e.message}, {status: 200});
//         }
//     }
//     const path = params.path.join("/");
//     if (path == 'task/submit') {
//         let data: any = null
//         try {
//             data = await req.json()
//         } catch (e) {
//             return NextResponse.json({code: 1, status: 'FAIL', msg: '无效的请求数据'}, {status: 200});
//         }
//         return NextResponse.json(api.submit(data), {status: 200});
//     } else if (path.startsWith('task/status') && params.path.length == 3) {
//         return NextResponse.json(api.status(params.path[2]), {status: 200});
//     }
//     return NextResponse.json({code: 1, status: 'FAIL', msg: '无效操作'}, {status: 200});
// }
//
// export const GET = handle;
// export const POST = handle;


import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";

const BASE_URL = process.env.MIDJOURNEY_PROXY_URL ?? null;
const API_SECRET = process.env.MIDJOURNEY_PROXY_API_SECRET ?? null;

async function handle(
    req: NextRequest,
    { params }: { params: { path: string[] } },
) {
    console.log("[Midjourney Route] params ", params);

    const customMjProxyUrl = req.headers.get("midjourney-proxy-url");
    let mjProxyUrl = BASE_URL;
    if (
        customMjProxyUrl &&
        (customMjProxyUrl.startsWith("http://") ||
            customMjProxyUrl.startsWith("https://"))
    ) {
        mjProxyUrl = customMjProxyUrl;
    }

    if (!mjProxyUrl) {
        return NextResponse.json(
            {
                error: true,
                msg: "please set MIDJOURNEY_PROXY_URL in .env or set midjourney-proxy-url in config",
            },
            {
                status: 500,
            },
        );
    }

    const authResult = auth(req);
    if (authResult.error) {
        return NextResponse.json(authResult, {
            status: 401,
        });
    }

    const reqPath = `${req.nextUrl.pathname}${req.nextUrl.search}`.replaceAll(
        "/api/midjourney/",
        "",
    );

    let fetchUrl = `${mjProxyUrl}/${reqPath}`;

    console.log("[MJ Proxy] ", fetchUrl);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 10 * 60 * 1000);

    const fetchOptions: RequestInit = {
        //@ts-ignore
        headers: {
            "Content-Type": "application/json",
            "mj-api-secret": API_SECRET,
        },
        cache: "no-store",
        method: req.method,
        body: req.body,
        signal: controller.signal,
        //@ts-ignore
        duplex: "half",
    };

    try {
        const res = await fetch(fetchUrl, fetchOptions);
        if (res.status !== 200) {
            return new Response(res.body, {
                status: res.status,
                statusText: res.statusText,
            });
        }

        return res;
    } finally {
        clearTimeout(timeoutId);
    }
}

export const GET = handle;
export const POST = handle;
