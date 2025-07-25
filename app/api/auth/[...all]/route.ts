import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import ip from "@arcjet/ip";


const emailValidation = aj.withRule(
    validateEmail({mode:'LIVE',block:['DISPOSABLE','INVALID','NO_MX_RECORDS']})
)

const rateLimit = aj.withRule(
    slidingWindow({
        mode:'LIVE',
        interval:'1m',
        max:10,
        characteristics:['fingerprint']
    })
)

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> =>{
    const session = await auth.api.getSession({headers: req.headers});

    let userId: string;

    if (session?.user?.id){
        userId = session.user.id;
    } else{
        userId = ip(req) || '127.0.0.1';
    }

    if (req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
        const body = await req.clone().json();

        if(typeof body.email === 'string') {
            return emailValidation.protect(req , {email: body.email})
        }
    }

    return rateLimit.protect(req, {fingerprint: userId});
}

const authHandlers = toNextJsHandler(auth.handler)

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
    const decision = await protectedAuth(req);

    if (decision.isDenied()) {
        if (decision.reason.isEmail()) {
            return NextResponse.json(
                { error: 'Email validation failed' },
                { status: 400 }
            );
        }

        if (decision.reason.isRateLimit()) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }

        if (decision.reason.isShield()) {
            return NextResponse.json(
                { error: 'Shield validation failed' },
                { status: 403 }
            );
        }
    }

    return authHandlers.POST(req);
};


