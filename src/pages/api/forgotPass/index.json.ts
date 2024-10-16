import type { APIRoute } from 'astro';
import { XataClient } from "../../../xata";

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export const POST: APIRoute = async ({ request }) => {

    const userData = await request.formData();

    const userID = await xata.db.users.search(userData.get("username")?.toString() || "", {
        fuzziness: 0,
        target: ['username']
    })

    if (userID.totalCount == 1 && userID.records[0].email == userData.get("email")?.toString()) {
        let resetPass = generateRandomText();
        
        const record = await xata.db.users.update(userID.records[0].id, {
            password: resetPass,
        });

        return new Response(JSON.stringify({
            message: "user found",
            userName: userID.records[0].fullName,
            rstPwd : resetPass,
            status: 200,
        }))
    }
    else
        return new Response(JSON.stringify({
            message: "user not found",
            status: 304,
        }))
}

function generateRandomText(length:number = 15) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}/~<>?';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    
    return result;
}