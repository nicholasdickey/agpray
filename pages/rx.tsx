import * as React from 'react';
import useSWRInfinite from 'swr/infinite';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { useRouter } from 'next/router'

import styled from 'styled-components';
import Script from 'next/script'


import {
  GetServerSidePropsContext,
} from "next";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head'
import { blueGrey } from '@mui/material/colors'
import useMediaQuery from '@mui/material/useMediaQuery';

//import { useSession, signIn, signOut } from "next-auth/react"
import { Roboto } from 'next/font/google';
import { AnyPtrRecord } from 'dns';
import Paper from '@mui/material/Paper';

import { fetchReport, FetchedReportKey } from '../lib/api';
import LoadMore from "@/components/load-more";

const getReport = async (): Promise<{ success: boolean, report: any }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/report`;
  console.log("getReport:", url);
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

const ReportItem = function (name: string, expanded: string, setExpanded: any, sessionid: string, reportItem: any) {
  let cs = false;
  let bot = false;
  let stamp = reportItem.stamp;
  console.log("reportItem.stamp:", reportItem);
  const items = reportItem.items.map((record: any, i: number) => {
    console.log("record:", record);
    let { url, name: eventName, utm_content = '', request = '', params = '', mode = '', fbclid = '', prayer = '', stamp = '', player = '', slug = '', view = '', time = '', isMobile, ssrTime, userId, t1, findexarxid, story, sid, ua } = record;

    request = decodeURIComponent(request);
    prayer = decodeURIComponent(prayer).replaceAll('<p>', '').replaceAll('</p>', '');
    if (eventName.indexOf('ssr') < 0)
      cs = true;
    if (eventName.indexOf('bot') >= 0) {
      bot = true;
      console.log("===============>>>>bot", name);
    }

    return (
      <Paper sx={{ background: "grey", m: 2, p: 2, color: "white", width: "100%" }} key={`keyasp-${i}`}>
        <Typography>Name: {eventName}</Typography>
        {ssrTime && <Typography>SSR Time:{ssrTime}</Typography>}
        {time && <Typography>SPA Time:{time}</Typography>}
        {t1 && <Typography>SSR start time (t1):{t1}</Typography>}
        {params && <Typography>Params{params}</Typography>}
        {fbclid && <Typography>fbclid:{fbclid}</Typography>}
        {stamp && <Typography>stamp:{stamp}</Typography>}
        {request && <Typography>Request:{request}</Typography>}
        {prayer && <Typography>Prayer:{prayer}</Typography>}
        {player && <Typography>Player:{player}</Typography>}
        {slug && <Typography>Slug:{slug}</Typography>}
        {url && <Typography>Url:{url}</Typography>}
        {view && <Typography>View:{view}</Typography>}
        {sid && <Typography>SID:{sid}</Typography>}
        {ua && <Typography>User Agent:{ua}</Typography>}
        {utm_content && <Typography>utm_content:{utm_content}</Typography>}
        {userId && <Typography>userId:{userId}</Typography>}
        {findexarxid && <Typography>findexarxid:{findexarxid}</Typography>}
        {story && <Typography>story:{story}</Typography>}
        {isMobile && <Typography>isMobile:{isMobile}</Typography>}
        {mode && <Typography>mode:{mode}</Typography>}
      </Paper>
    )
  });


  return <Accordion key={name} style={{ background: '#844', color: "white", borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded == sessionid} onChange={() => setExpanded(expanded == sessionid ? '' : sessionid)}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel4bh-content"
      id="panel4bh-header"
    >
      <Typography sx={{ width: '83%', flexShrink: 0, color: bot ? "#004400" : items.length > 2 && cs ? "#afa" : items.length > 1 && cs ? "#aa4" : "888" }}>{reportItem.stamp}&nbsp;:&nbsp;{name}</Typography> <Typography sx={{ width: '63%', flexShrink: 0, color: bot ? "#004400" : items.length > 1 && cs ? "#faa" : "888" }}>{reportItem.items.length}&nbsp;&nbsp;</Typography>
    </AccordionSummary>
    <AccordionDetails style={{ borderRadius: 14 }}>
      <Box sx={{ my: 4 }}>
        {items}
      </Box>
    </AccordionDetails>
  </Accordion>
}


const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
let v = false;
export default function Report({ }:
  {}) {


  const router = useRouter();
  const matches = useMediaQuery('(min-height:600px)');
  const [expanded, setExpanded] = React.useState<string>("");
  const canvasRef = React.useRef<HTMLDivElement>(null);
  let theme: any;
  const fetchReportKey = (pageIndex: number, previousPageData: any): FetchedReportKey | null => {
    let key: FetchedReportKey = { type: "FetchedReport", page: pageIndex };
    if (previousPageData && !previousPageData.length) return null // reached the end
    return key;
  }
  const { data, error: storiesError, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(fetchReportKey, fetchReport, { initialSize: 1, revalidateAll: true, parallel: true })
  if (data)
    console.log("R1", ...(data as any[]))

  //let report:{}={};
  let itemsAll: any[] = [];
  if (data)
    for (let i = 0; i < data.length; i++) {
      const sub = data[i];
      for (const key in sub) {
        const item = sub[key];
        const { sessionid, items } = item
        itemsAll.push(ReportItem(`${sessionid},items:${items.length};last:${items.length > 0 ? items[0].name : ''}`, expanded, setExpanded, sessionid, item))
      }
    };
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  let isEmpty = data?.[0]?.length === 0;
  let isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < 5);

  return (
    <>
      <Head>
        <title>A Report</title>
        <meta name="viewport" content="width=device-width" />
      </Head>

      <main className={roboto.className} >
        <div>
          <CssBaseline />
        </div>
        <Script src={`https://www.googletagmanager.com/gtag/js?${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
        </Script>
        <div style={{ padding: "20px", background: "#444", color: "white", position: "absolute", top: "0" }}>
          {itemsAll}
          <LoadMore setSize={setSize} size={size} isLoadingMore={isLoadingMore || false} isReachingEnd={isReachingEnd || false} />
           <br/>
           <br/>  
        </div>

      </main>


    </>
  )
}
export const getServerSideProps =
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {


      const data = await getReport();
      console.log("got report:", data)
      let report: any = null;
      if (data?.success) {
        report = data.report;
      }


      return {
        props: {
          report
        }
      }
    } catch (x) {
      console.log("FETCH SSR PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  }
