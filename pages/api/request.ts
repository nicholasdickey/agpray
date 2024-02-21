
import { NextApiRequest, NextApiResponse } from "next";
const api_key = process.env.LAKE_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  let { request} = req.body;
  console.log("request api",{request});
  const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/request?request=${request}&api_key=${api_key}`)
  const data = await fetchResponse.json();
  res.status(200).json(data)
};
export default handler;