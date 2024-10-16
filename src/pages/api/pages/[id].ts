import type { APIRoute } from "astro";
import { XataClient } from '../../../xata.ts';
// Generated with CLI
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

interface pageStructure{
    pageTitle : string,
    pageSlug : string,
    pageContent : string,
    PageDescription : string,
}

//#region Returns Panel Information by ID
export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    // console.log("Parameter received - ", id);
    
    const record = await xata.db.pages.read(id?.toString() || "");
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

//#region Updates Panels Information by ID
export const PUT : APIRoute = async ({params, request}) =>{
    const data = await request.formData();
    const id = params.id;

    if (!data) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    let dataToUpdate : pageStructure ={
        pageTitle: data.get("titlePage")?.toString() || "",
        pageSlug: data.get("pageSlug")?.toString() || "",
        pageContent: data.get("pageContent")?.toString() || "",
        PageDescription: data.get("pageMetaDesc")?.toString() || "",
    };

    // console.log("received in API - " , data);
    // console.log("received in API - " , dataToUpdate);
    try {
        const record = await xata.db.pages.update(id?.toString() || "", dataToUpdate)
        // console.log(record);

        if (record!.id) {
            return new Response(
                JSON.stringify({
                    id: id,
                    message: "Page Data Updated Successfully",
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
    } catch (error:any) {
        // console.log("New Page API Error Message", error.errors[0].message);
      return new Response(
        JSON.stringify({
           status: 422,
           message: `Page Update API Error Message- ${error.errors[0].message}`
        }),
        { status: 422 }
     );
    }
}
//#endregion

//#region Delete Panels Information by ID
export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    const record = await xata.db.pages.delete(id?.toString() || "");
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status : 200,
                message: `${id} Deleted from the Database`
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