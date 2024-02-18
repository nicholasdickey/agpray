import * as React from 'react';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { AppBar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useState, useCallback, useEffect } from "react"
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
const getReport = async (): Promise<{ success: boolean, report: any }> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/report`;
  console.log("getReport:", url);
  const res = await fetch (url);
  const json=await res.json();
  return json;
}

const ReportItem= function(name:string,expanded:string,setExpanded:any,sessionid:string,reportItem:any){
  let cs=false;  
  let bot=false;
  
  const items=reportItem.items.map((record:any,i:number)=>{
      console.log("record:",record);
        let {url,name:eventName,utm_content='',request='',params='',fbclid='',prayer='',stamp='',player='',slug='',view='',time='',isMobile,ssrTime,userId,t1,findexarxid,story,sid,ua}=record;
       
        request=decodeURIComponent(request);
        prayer=decodeURIComponent(prayer).replaceAll('<p>','').replaceAll('</p>','');
        if(eventName.indexOf('ssr')<0)
          cs=true;
        if(eventName.indexOf('bot')>=0){
          bot=true;
          console.log("===============>>>>bot",name);
        }
          
        return (
           <Paper sx={{background:"grey",m:2,p:2,color:"white",width:"100%"}} key={`keyasp-${i}`}>
                <Typography>Name: {eventName}</Typography>
                {ssrTime&&<Typography>SSR Time:{ssrTime}</Typography>}
                {time&&<Typography>SPA Time:{time}</Typography>}
                {t1&&<Typography>SSR start time (t1):{t1}</Typography>}
                {params&&<Typography>Params{params}</Typography>}
                {fbclid&&<Typography>fbclid:{fbclid}</Typography>}
                {stamp&&<Typography>stamp:{stamp}</Typography>}
                {request&&<Typography>Request:{request}</Typography>}
                {prayer&&<Typography>Prayer:{prayer}</Typography>}
                {player&&<Typography>Player:{player}</Typography>}
                {slug&&<Typography>Slug:{slug}</Typography>}
                {url&&<Typography>Url:{url}</Typography>}
                {view&&<Typography>View:{view}</Typography>}
                {sid&&<Typography>SID:{sid}</Typography>}
                {ua&&<Typography>User Agent:{ua}</Typography>}
                {utm_content&&<Typography>utm_content:{utm_content}</Typography>}
                {userId&&<Typography>userId:{userId}</Typography>}
                {findexarxid&&<Typography>findexarxid:{findexarxid}</Typography>}
                {story&&<Typography>story:{story}</Typography>}
                {isMobile&&<Typography>isMobile:{isMobile}</Typography>}


                
           </Paper>
        )
        });

  
    return <Accordion key={name} style={{ background:'#844',color:"white",  borderRadius: 14 }} sx={{ mt: 5 }} expanded={expanded == sessionid} onChange={()=>setExpanded(expanded==sessionid?'':sessionid)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: '33%', flexShrink: 0,color:bot?"#004400":items.length>1&&cs?"#afa":"888" }}>{name}</Typography>
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
export default function Report({ report}:
  { report:any}) {


  const router = useRouter();
  const matches = useMediaQuery('(min-height:600px)');
const [expanded,setExpanded]=React.useState<string>("");
  const canvasRef = React.useRef<HTMLDivElement>(null);
  let theme: any;
  let itemsAll:any[]=[];
  for (const key in report){
    const item=report[key];
    const {sessionid,items}=item
    itemsAll.push(ReportItem(`${sessionid},items:${item.items.length};last:${items.length>0?items[0].name:''}`,expanded,setExpanded,sessionid,item))
  };


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
         <div style={{padding:"20px",background:"#444",color:"white",position:"absolute",top:"0"}}>
          {itemsAll}
         </div>   
        
        </main>

     
    </>
  )
}
export const getServerSideProps =
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
  
 
      const data = await getReport();
      console.log("got report:",data)
      let report:any=null;
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
