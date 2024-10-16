import type { APIRoute } from "astro";
import { XataClient } from "../../../xata";

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;

  const xataResponse = await xata.db.users.read(id || "");
  if (xataResponse != null && xataResponse!.id == id)
    return new Response(
      JSON.stringify({
        xataResponse,
        status: 200
      })
    )

  return new Response(
    JSON.stringify({
      message: "session expired",
      status: 300
    })
  )
}