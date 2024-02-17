import React, { useCallback, useState, useEffect } from 'react';
import Head from "next/head";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getCookie,setCookie } from 'cookies-next';
import { Roboto } from 'next/font/google';
//styled-components
import { styled, ThemeProvider } from "styled-components";
import { ThemeProvider as MuiTP } from '@mui/material/styles';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IosShareIcon from '@mui/icons-material/IosShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Stack from "@mui/material/Stack";
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { palette } from '@/lib/palette';
import GlobalStyle from '@/lib/globalstyles';
import useCopyToClipboard from '@/lib/copy-to-clipboard';
import { isbot } from '../lib/isbot.js';

const Welcome = styled.div`
  color: var(--text);
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
 // background-color: #aaa;//var(--background);
  min-height:120px;
  padding-top:30px;
  padding-bottom:20px;
  @media (max-width: 900px) {
    font-size: 2.0rem;
    padding-left:20px;
    padding-right:20px;
  }
  
  //color:#fff;
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width:100%;

// height: 100vh;
`;
const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  height:100%;
 // padding:20px;
  color: var(--text) !important;
  line-height: 1.6;
  background-color: var(--background);
  input{
    color: var(--text) !important;
  }
  &.MuiFormHelperText-root{
    color: var(--text) !important;
  }
  label{
    color: var(--text) !important;
  }
  button{
    color: var(--text) !important;
  }
  div{
    color: var(--text) !important;
  }
  &.MuiFormControl-root {
    color: var(--text) !important;

  }
 
  label.Mui-focused {
    color: #A0AAB4;
  }
  &.MuiInput-underline:after {
    border-bottom-color: #B2BAC2 !important;
  }
  &.MuiOutlinedInput-root {
    fieldset {
      border-color: #E0E3E7 !important;
    }
    &:hover fieldset {
      border-color: #B2BAC2 !important;
    }
    &.Mui-focused fieldset {
      border-color: #6F7E8C;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  //margin:20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '700'], style: ['normal', 'italic'] })
interface Props{
  sessionid:string;
  utm_content:string;
  t1:number;
  dark:number;
  isbot:boolean;
  isfb:boolean;
  fbclid:string;
}
export default function Home({sessionid,utm_content,dark}:Props) {
  const muiTheme = useTheme();
  dark=1;
  const [localMode, setLocalMode] = React.useState(dark==1?'dark':'light');
  const [request, setRequest] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [value, copy] = useCopyToClipboard();
  const [responseCopied, setResponseCopied] = useState(false);
  const mobile = useMediaQuery('(max-width:900px)');
  const onResponseCopyClick = useCallback(() => {
    setResponseCopied(true);
    copy(response);
  }, [response, copy]);

  useEffect(() => {
    setTimeout(() => {
      setResponseCopied(false);
    }
      , 2000);
  }, [responseCopied]);

   const recordEvent = useCallback(async (sessionid: string, name: string,params:string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
      await fetch(url);  
    }
    catch (e) {
      console.log("recordEvent", e);
    
    }
  },[request,response,sessionid]);
  const onSend = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/request?request=${request}`)
    const data = await res.json();
    setLoading(false);
    console.log("GOt data", data)
    if (data.success){
      const params=`{"utm_content":"${utm_content}","request":"${encodeURIComponent(request)}","prayer":"${encodeURIComponent(data.prayer)}"}`;
  
      await recordEvent(sessionid, 'prayer-request',params);
      setResponse(data.prayer);
    }
  }, [request]);
  useEffect(() => {
    const handle = async (e: KeyboardEvent): Promise<void> => {
      if (e.key === "Enter" && !loading) {
        await onSend();
      }
    };
    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
    };
  }, [onSend, loading]);
  return (
    <>
      <Head>
        <title>Assemblies of God Prayer Network</title>
        <meta name="description" content="Helps to generate prayer text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/wbLogo.png" />
      </Head>
      <MuiTP theme={muiTheme}>
        <main className={roboto.className} >
          <ThemeProvider
            //@ts-ignore
            theme={palette}>
            <GlobalStyle $light={localMode == "light"} />
          
            <Welcome>Welcome to the Assemblies of God Prayer Network</Welcome>
            <VerticalContainer><Container maxWidth="sm">

              <Stack><TextField    helperText={<span style={{color:"#888"}}>Hint: You can type in any language.</span>} inputRef={input => input && input.focus()} color="success" focused sx={{ m: 3 }} onChange={(event: any) => { setRequest(event.target.value) }} label={`Type your prayer summary${mobile?`:`:`. Like 'asking for...' or 'thankful for...', etc.`}`} variant="standard" value={request}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{ visibility: request ? "visible" : "hidden" }}
                      onClick={() => { setRequest('') }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }} /></Stack>
              <InputContainer>{loading ? 'Loading...' : <Button type="submit" onClick={async (event: any) => { await onSend(); }}>Submit</Button>}</InputContainer>
              {!loading && response&&<div><div style={{ width: "100%", padding: 20, marginTop: 20, borderRadius: "4px", minHeight: "100px" }} dangerouslySetInnerHTML={{
                __html: response
              }} />     <ContentCopyIcon style={{ paddingTop: 6, marginTop: -10, cursor: 'pointer' }} fontSize="small" sx={{ color: responseCopied ? 'green' : '' }} onClick={() => onResponseCopyClick()} />
              </div>}

            </Container>
           
            </VerticalContainer>
       
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  );
}
export const getServerSideProps =
    async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {
      console.log(123)
        let { fbclid, utm_content, dark }:
            { fbclid: string, utm_content: string, dark: number } = context.query as any;
        utm_content = utm_content || '';
        fbclid = fbclid || '';
        const ua = context.req.headers['user-agent'];
        const botInfo = isbot({ ua });
        let host = context.req.headers.host || "";
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let fresh = false;
        console.log(111)
        const recordEvent = async (sessionid: string, name: string,params:string) => {
          try {

            const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
           console.log("fetch url:",url)
            await fetch(url);  
           
          }
          catch (e) {
            console.log("recordEvent", e);
          
          }
        };
        let sessionid=getCookie('sessionid', { req:context.req, res:context.res });
      
        if(!sessionid){
            fresh=true;
            sessionid = randomstring();
            setCookie('sessionid', sessionid, { req:context.req, res:context.res, maxAge: 60 * 6 * 24 });  
        }
        if (!botInfo.bot) {
            console.log('ssr-prayer-init2');
            try {
                console.log("recordEvent")
                await recordEvent(sessionid, `ssr-prayer${fresh?'-init':''}`, `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-prayer-init-error', x);
            }
        }
        if (botInfo.bot) {
            try {
                await recordEvent(sessionid, 'ssr-bot-prayer-landing', `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
            } catch (x) {
                console.log('ssr-bot-prayer-landing-init-error', x);
            }
        }
        return {
            props: {
                sessionid,
                fbclid,
                utm_content,
                isbot: botInfo.bot,
                isfb: botInfo.fb || fbclid ? 1 : 0,
                dark: dark || 0,
                t1:0

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

