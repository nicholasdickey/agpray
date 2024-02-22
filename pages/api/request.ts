
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute, Options } from "@/lib/with-session";
//import {updateUserSession} from "../../../lib/lake-api"


const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(!req.session||!req.session.options){
        res.status(401).send({ message: 'No session found' });
        return;
    }
    let options: Options = req.session.options;
    let sessionid = options.sessionid;
  
  let { request} = req.query;
  console.log("request api",{request});
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/request?request=${request}&api_key=${api_key}&sessionid=${sessionid}`)
  const data = await fetchResponse.json();
  res.status(200).json(data)
};
export default withSessionRoute(handler);