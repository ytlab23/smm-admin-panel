import { XataClient } from '../../../xata.ts';
// Generated with CLI

const xata = new XataClient({ apiKey: import.meta.env.XATA_API_KEY, branch: import.meta.env.XATA_BRANCH });

export async function GET() {
    //Only for Fetching Site Data
    try {
        const records = await xata.db.siteSettings
            .select([
                "SiteTitle",
                "siteMetaDescription",
                "emailAutoReplyContent",
                "homeHeaderText",
                "homeHeaderPara",
                "homePanelCount",
                "platformServiceCount",
                "siteFavicon",
                "siteLog",
                "homeBackgroundImage",
                "siteDeployHook",
                "adminPath",
            ])
            .getAll();

        return new Response(
            JSON.stringify(records),
         )
    } catch (error:any) {
        console.log("Error Occured at Pages API GET", error);
    }
}
 