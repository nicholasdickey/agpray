import { Options } from '@/lib/with-session';

// SWR infinite:
// SWR get stories and mentions grouped by story
// 
export type FetchedReportKey = { type: string, page:number };
export const fetchReport = async ({ type, page }: FetchedReportKey) => {
  try {

    console.log("api: fetchReport",type,page)
    let url = '';
   
    url =  `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/report?page=${page||0}`;
    
    console.log("fetchReport-url",url)
    // const res = await axios.get(url);
    const res=await fetch(url); 
    const data=await res.json();
    console.log("fetchReport",data);
    return data.report;
  }
  catch (e) {
    console.log("fetchReport", e);
    return false;
  }
}