import type { APIRoute } from "astro";
import { XataClient } from '../../../xata.ts';
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

interface usersStructure{
    username ?: string
    email ?: string
    fullName ?: string
    password ?: string
    ProfilePic ?: {
        name? : string,
        mediaType? : string,
        base64Content? : string
    },
}
/* 
interface userPasswordStructure{
    password : string
    previousPassword : string
} */

//#region Returns user Information by ID
export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    // console.log("Parameter received - ", id);
    
    const record = await xata.db.users.read(id?.toString() || "");
    
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status: 200,
                data: record,
            }))
    }
    else {
        return new Response(
            JSON.stringify({
                id: id,
                status: 404,
                message: `${id} Not Found in the Database`
            }))
    }
}
//#endregion

//#region Updates user Information by ID
export const PUT : APIRoute = async ({params, request}) =>{
    const data = await request.formData();
    const id = params.id;
    console.log("received in API - " , data);

    if (!data) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    let dataToUpdate :usersStructure = {};
    if(data.get("updateUsersDetails")?.toString() == "true"){
        //Other details Update
        dataToUpdate = {
            username: data.get("newUsername")?.toString() || "",
            email: data.get("NewEmailAddress")?.toString() || "",
            fullName: data.get("newName")?.toString() || "",
        };

        if (data.get("imageName") || data.get("imageFileType") || data.get("imageBase64")) {
            dataToUpdate.ProfilePic = {
                name: data.get("imageName")?.toString() || "",
                mediaType: data.get("imageFileType")?.toString() || "",
                base64Content: data.get("imageBase64")?.toString() || ""
            };
        }
    }
    else{
        //Only Password Update
        dataToUpdate = {
            password: data.get("newPass")?.toString() || "",
        }
    }

    // console.log("received in API - " , dataToUpdate);
    
    const record = await xata.db.users.update(id?.toString() || "", dataToUpdate)
    // console.log(record);
    
    if (record!.id) {
        return new Response(
           JSON.stringify({
            id: id,
            message : "User Data Updated Successfully",
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

//#region Delete User Information by ID
export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    const record = await xata.db.users.delete(id?.toString() || "");
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status : 200,
                message: `User- ${id}, Deleted from the Database`
            }))
    }
    else {
        return new Response(
            JSON.stringify({
                id: id,
                status : 404,
                message: `${id} Not Found in the Database`
            }))
    }
}
//#endregion