import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });


//#region Fetching All Services
export async function GET() {
    try {
        const records = await xata.db.users.sort('fullName', 'asc')
        .select(["username", "fullName", "role", "email", "ProfilePic"])
        .getAll();

        return new Response(
            JSON.stringify(records),
        )
    } catch (error:any) {
        console.log("Error occured at API/Services/index", error);
        return new Response(
            JSON.stringify(error),
        )
    }
}
//#endregion

//#region Inserting a Services record
export const POST:APIRoute = async ({request}) => {

    const userData = await request.formData();
    // console.log("Service Received in API - " , servicesData);

    var FName = userData.get("userFullName")?.toString() || "";
    let randomUsername = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
        randomUsername += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    randomUsername = `@${FName.substring(0, 3).trim().replaceAll(" ", "")}_${randomUsername}`;
    
    const record = await xata.db.users.create({
        fullName: FName,
        role: userData.get("roleValue")?.toString(),
        username: randomUsername.toLowerCase(),
    });

    if (record.id) {
        return new Response(
           JSON.stringify({
            newUsername : record.username,
            message: "User Data Saved Successfully"
           }),
           { status: 200 }
        );
     }
     else
        return new Response(
           JSON.stringify({
              message: "Data saving Error!"
           }),
           { status: 300 }
        );
}
//#endregion