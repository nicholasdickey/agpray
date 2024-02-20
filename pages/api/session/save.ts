// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute, Options } from "@/lib/with-session";
//import {updateUserSession} from "../../../lib/lake-api"
export default withSessionRoute(handler);

/**
 * Note: the incoming session object could be only partial, will be merged over existing session
 * 
 * @param req 
 * 
 * @param res 
 * @returns 
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    let options: Options = req.session.options ? req.session.options : ({ width: 0} as Options);
    const body = req.body;
    
    let inSession = body.session ? (body.session) : {};
    req.session.options = Object.assign(options, inSession);
  
    await req.session.save();
   /* if(req.session.options?.userslug){
       await updateUserSession(req.session.options.userslug,req.session.options);
    }*/

    res.status(200).json({})
}
