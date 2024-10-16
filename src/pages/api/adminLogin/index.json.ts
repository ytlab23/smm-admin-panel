import type { APIRoute } from 'astro';
import { XataClient } from "../../../xata";

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export const POST: APIRoute = async ({ request }) => {

    const userData = await request.formData();
    // console.log(userData);
    // console.log(userData.get("g-recaptcha-response")?.toString());

    const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
    const requestHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const requestBody = new URLSearchParams({
        secret: import.meta.env.CapchaSecretKey,   // This can be an environment variable
        response: userData.get("g-recaptcha-response")?.toString() || ""          // The token passed in from the client
    });

    const response = await fetch(recaptchaURL, {
        method: "POST",
        headers: requestHeaders,
        body: requestBody.toString()
    });

    const responseData = await response.json();
    // console.log("Captcha Response- ", responseData);

    // return new Response(JSON.stringify(responseData), { status: 200 });

    const userID = await xata.db.users.search(userData.get("username")?.toString() || "", {
        fuzziness: 0,
        target: ['username']
    })

    if (!responseData.success) {
        return new Response(JSON.stringify({
            message: "reCAPTCHA verification failed",
            captchaRes : responseData,
            'error-codes': responseData['error-codes'],
            status: 400,
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    else {
        if (userID.totalCount == 1 && userID.records[0].password == userData.get("password")?.toString()) {
            return new Response(JSON.stringify({
                message: "user found",
                userID: userID.records[0].id,
                status: 200,
                captcha: responseData
            }))
        }
        else
            return new Response(JSON.stringify({
                message: "user not found",
                status: 304,
                captcha: responseData
            }))
    }
}