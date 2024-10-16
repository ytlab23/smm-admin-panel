import type { APIRoute } from "astro";
import { XataClient } from '../../../xata.ts';
// Generated with CLI
const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

interface sidebarWidgetStructure{
    widgetTitle : string;
    widgetCodeBlock : string;
}

//#region Updates Site Information by ID
export const PUT : APIRoute = async ({params, request}) =>{
    const data = await request.formData();
    console.log("received in API - " , data);
    const id = params.id;
    
    if (!data) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    let dataToUpdate : sidebarWidgetStructure ={
        widgetTitle : data.get("widgetTitle")?.toString() || "",
        widgetCodeBlock : data.get("widgetHTMLCode")?.toString() || "",
    };

    // console.log("Modified for API - " , dataToUpdate);
    
    const record = await xata.db.sidebarWidgets.update(id?.toString() || "", dataToUpdate)
    // console.log(record);
    
    if (record!.id) {
        return new Response(
           JSON.stringify({
            id: id,
            message : "Sidebar Widget Data Updated Successfully",
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

//#region Delete Panels Information by ID
export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    const record = await xata.db.sidebarWidgets.delete(id?.toString() || "");
    // console.log(record);
    if (record!.id == id) {
        return new Response(
            JSON.stringify({
                id: id,
                status : 200,
                message: `Sidebar Widget ID- ${id}, Deleted from the Database`
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