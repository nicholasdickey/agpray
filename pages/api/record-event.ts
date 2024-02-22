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
   
    if(!req.session||!req.session.options){
        console.log("no session found")
        res.status(401).send({ message: 'No session found' });
        return;
    }
    let options: Options = req.session.options;
    let sessionid = options.sessionid;
    let {name="",params=""} = req.query as {name:string,params:string};
    if(!name){
        res.status(400).send({ message: 'No name param present' });
        return;
    }
    
    const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
    console.log("api url",url);
    const ret=await fetch(url); 
    res.status(200).json(ret)
}
