import React, { useCallback, useState, useEffect, useRef } from 'react';
import Head from "next/head";
import Script from "next/script";
import { GetServerSidePropsContext } from "next";
import { getCookie, setCookie } from 'cookies-next';
import { Roboto } from 'next/font/google';
//styled-components
import { styled, ThemeProvider } from "styled-components";
import { ThemeProvider as MuiTP } from '@mui/material/styles';
import Button from '@mui/material/Button';

import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IosShareIcon from '@mui/icons-material/IosShare';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import Stack from "@mui/material/Stack";
import { IconButton } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ModeNightTwoToneIcon from '@mui/icons-material/ModeNightOutlined';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeOutlined';

import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import { RWebShare } from "react-web-share";

import { palette } from '@/lib/palette';
import GlobalStyle from '@/lib/globalstyles';
import useCopyToClipboard from '@/lib/copy-to-clipboard';
import { isbot } from '../lib/isbot.js';
import { withSessionSsr, Options } from '../lib/with-session';
interface IProps {
  isMobile: boolean;
}
const Welcome = styled.div<IProps>`
  color: var(--text);
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  //min-height:100px;
  padding-top:${({ isMobile }) => isMobile ? 40 : 40}px;
  padding-bottom:30px;
  @media (max-width: 900px) {
    font-size: 1.7rem;
    padding-left:20px;
    padding-right:20px;
  }
`;
const Subtitle = styled.div`
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  min-height:20px;
  //padding-top:3px;
  //padding-bottom:20px;
  @media (max-width: 900px) {
    font-size: 1.0rem;
    padding-left:20px;
    padding-right:20px;
  }
`;
const Subtitle2 = styled.div`
 // position: absolute;
  bottom:0px;
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  min-height:110px;
  //padding-top:3px;
  //padding-bottom:20px;
  @media (max-width: 900px) {
    font-size: 0.6rem;
    padding-left:10px;
    padding-right:10px;
  }
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width:100%;
  height:20px;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
 // min-height: 100%;
  //height:100%;
  color: var(--text) !important;
  line-height: 1.6;
  background-color: var(--background);
  //padding-right:50px;
  input{
    margin-top:6px;
    color: var(--text) !important;
    height:40px !important;
  }
  textarea{
    margin-top:6px;
    color: var(--text) !important;
    height:40px !important;
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
const SpreadOut = styled.div`
  font-family: 'Roboto', 'Arial', Arial, sans-serif;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
`;
const ShareContainer = styled.div`
    font-size: 28x;  
    height:38px;
    opacity:0.6;
    cursor:pointer;
    color:var(--mention-text);
    :hover{
        opacity:1;
        color: var(--highlight);
    }
    :hover:active{
        opacity:1;
        color:var(--highlight);
    }
`;

const ShareIcon = styled.div`
    margin-top:-1px;
    padding-bottom:4px;
`;

const ShareContainerInline = styled.span`
    font-size: 28x;  
    height:38px;
    opacity:0.6;
    cursor:pointer;
    margin-left:10px;
    color:var(--mention-text);
    :hover{
        opacity:1;
        color: var(--highlight);
    }
    :hover:active{
        opacity:1;
        color:var(--highlight);
    }
`;

const ShareGroup = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-start;
    width:78px;
    height:40px;
    margin-top:10px;
`;
const CrossContainer = styled.div`
  display: absolute;
  bottom:0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width:100%;
  padding-top:20px;
  padding-bottom:20px;
  padding-left:20px;
  padding-right:20px;
`;
const Cross = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width:100%;
  padding-top:20px;
  padding-bottom:20px;
  padding-left:20px;
  padding-right:20px;
  opacity:0.4;
`;
const ModeSwitch = styled.div`
  position:absolute;
  right:200px;
  top:20px;  
  z-index:100; 
  //color:white; 
 
  @media (max-width: 700px) {
    top:-10px;
    right:0px;
    font-size:3rem;;
    min-height: 20px;
  }
  `;
const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400','500', '700'], style: ['normal', 'italic'] })
interface Props {
  //sessionid: string;
  utm_content: string;
  t1: number;
  //dark: number;
  isbot: boolean;
  isfb: boolean;
  fbclid: string;
  isMobile: boolean;
  options: Options;
}
export default function Home({ options: session, utm_content, isMobile }: Props) {
  const muiTheme = useTheme();
  const { dark, sessionid } = session;
  const [localMode, setLocalMode] = useState(session.dark != -1 ? session.dark == 1 ? 'dark' : 'light' : "unknown")
  const [request, setRequest] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [prayer, setPrayer] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [value, copy] = useCopyToClipboard();
  const [responseCopied, setResponseCopied] = useState(false);

  console.log("session:", session);
  console.log("localMode:", localMode);
  useEffect(() => {
    setPrayer(response.replaceAll("<p>", "").replaceAll("</p>", "\n\n").replaceAll("<br>", "\n\n").replaceAll("<br/>", "").replaceAll("<br />", "").replaceAll("<div>", "").replaceAll("</div>", "").replaceAll("<div/>", "").replaceAll("<div />", ""));
  }, [response]);

  const onResponseCopyClick = useCallback(() => {
    setResponseCopied(true);
    copy(prayer);
  }, [prayer, copy]);

  useEffect(() => {
    setTimeout(() => {
      setResponseCopied(false);
    }
      , 2000);
  }, [responseCopied]);


  const recordEvent = useCallback(async (sessionid: string, name: string, params: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
      await fetch(url);
    }
    catch (e) {
      console.log("recordEvent", e);

    }
  }, [request, response, sessionid]);

  const onSend = useCallback(async () => {
    setLoading(true);
    // const res = await fetch(`${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/prayer/request?request=${request}`)
    const res = await fetch(`/api/request?request=${request}`)
    const data = await res.json();
    setLoading(false);
    // console.log("GOt data", data)
    if (data.success) {
      const params = `{"utm_content":"${utm_content}","request":"${encodeURIComponent(request)}","prayer":"${encodeURIComponent(data.prayer)}"}`;

      await recordEvent(sessionid, 'prayer-request', params);
      setResponse(data.prayer);
    }
  }, [request]);
  //saves the changes to the session on the local web server. 
  const updateMode = useCallback(async (newMode: number) => {
    setLocalMode(newMode == 1 ? 'dark' : 'light');
    await fetch(`/api/session/save`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ session: { dark: newMode } })
      });
    console.log("updateMode", newMode);
  }, []);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (localMode == "unknown") {
      //setLocalMode(darkModeQuery.matches ? 'dark' : 'light');
      document.body.setAttribute("data-theme", darkModeQuery.matches ? 'dark' : 'light');
    }
    if (localMode == 'unknown') {
      updateMode(darkModeQuery.matches ? 1 : 0)
    }
  }, [localMode, session.dark, updateMode]);

  useEffect(() => {
    //@ts-ignore
    const handle = async (e: KeyboardEvent): Promise<void> => {
      if (e.key === "Enter" && !loading && !isMobile) {
        await onSend();
      }
    };
    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
    };
  }, [onSend, loading]);

  const onShare = useCallback((url: string) => {
    try {
      recordEvent(sessionid as string || "", `prayer-share`, `{"url":"${url}","utm_content":"${utm_content}"}`)
        .then((r: any) => {
          console.log("recordEvent", r);
        });
    } catch (x) {
      console.log('recordEvent', x);
    }
  }, [sessionid, utm_content]);

  //console.log("Prayer:", prayer);
  const ogTitle = "Pentecostal Prayer";
  const ogDescription = "Discover spiritual upliftment with our dedicated prayer composer for Pentecostal followers. This unique app offers personalized prayers, inspired by the Holy Spirit, to guide you in your faith journey. Whether for guidance, healing, or thanksgiving, our tool helps you connect deeply with God's word and power, enriching your prayer life with daily devotionals tailored to your spiritual needs.";
  const ogUrl = "https://www.pray50.com";
  const ogImage = `${process.env.NEXT_PUBLIC_SERVER}/wt-logo-512.png`;
  const noindex = +(process.env.NEXT_PUBLIC_NOINDEX || "0");
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setResponseCopied(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Head>
        <title>Pentecostal Prayer</title>
        {(noindex == 1) && <meta name="robots" content="noindex,nofollow" />}
        <link rel="canonical" href={ogUrl} />
        <meta name="description" content="Helps to generate prayer text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <link rel="icon" href="/wbLogo.png" />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@findexar" />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />

      </Head>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-NXRDG3LTLR`} strategy="afterInteractive"></Script>
      <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NXRDG3LTLR', {
            page_path: window.location.pathname,
          });
        `,
      }} />

      <MuiTP theme={muiTheme}>
        <main style={{ height: "100vh" }} className={roboto.className} >
          <ThemeProvider
            //@ts-ignore
            theme={palette}>
            <GlobalStyle $light={localMode == "light"} />
            <ModeSwitch>
              <Button color={"inherit"} onClick={() => {
                // setLocalMode(localMode=="dark"?"light":"dark");
                // setModeIsSet(true);
                updateMode(localMode == "dark" ? 0 : 1);

              }}>
                {localMode == 'dark' ? <LightModeTwoToneIcon fontSize="small" /> : <ModeNightTwoToneIcon fontSize="small" />}
              </Button>
            </ModeSwitch>
            <SpreadOut>
              <div>
                <Welcome isMobile={isMobile}>Welcome to Pray50!</Welcome>
                <Subtitle>A Pentecostal Prayer Companion.</Subtitle>

                <VerticalContainer><Container maxWidth="sm">
                  <TextField
                    ref={(input) => { if (input) setTimeout(() => { input.focus(); }, 500) }}
                    fullWidth
                    style={{ paddingRight: 50 }}
                    helperText={<><span style={{ color: "#776" }}> Examples: to find a job, grateful for my health{isMobile ? '' : ', prepare a dinner'}...</span></>}
                    multiline={isMobile ? true : false}
                    maxRows={isMobile ? 4 : 1}
                    focused
                    color="success" sx={{ m: 3 }} onChange={(event: any) => { setRequest(event.target.value) }}
                    label={`Type your prayer topic:`} variant="outlined" value={request}
                    inputProps={{
                      autoFocus: true,
                    }}
                    InputProps={{

                      endAdornment: (
                        <IconButton
                          sx={{ visibility: request ? "visible" : "hidden" }}
                          onClick={() => { setRequest('') }}
                        >
                          <ClearIcon />
                        </IconButton>
                      ),
                    }} />
                  <InputContainer>{loading ? 'Loading...' : <Button onClick={async (event: any) => { await onSend(); }}>Submit</Button>}</InputContainer>
                  {!loading && response && <div><div onClick={() => onResponseCopyClick()} style={{ width: "100%", padding: 20, marginTop: 20, borderRadius: "4px", minHeight: "100px" }} dangerouslySetInnerHTML={{
                    __html: response
                  }} />
                    <ShareGroup>   {false && <ContentCopyIcon style={{ paddingTop: 6, marginTop: -10, cursor: 'pointer' }} fontSize="small" sx={{ color: responseCopied ? 'green' : '' }} onClick={() => onResponseCopyClick()} />}
                      <RWebShare
                        data={{
                          text: prayer,
                          url: ogUrl,
                          title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
                        }}
                        onClick={async () => await onShare(ogUrl)}
                      >
                        <ShareContainer><ShareIcon><IosShareIcon /></ShareIcon></ShareContainer>
                      </RWebShare></ShareGroup>

                  </div>}

                </Container>
                  <Snackbar
                    open={responseCopied}
                    autoHideDuration={6000}
                    onClose={() => setResponseCopied(false)}
                    message="Copied to clipboard"
                    action={action}
                  />
                  <CrossContainer><Cross><img src={localMode=='dark'?"/pente2.png":"/pente.png"} width="40" /></Cross></CrossContainer>

                </VerticalContainer>
              </div>
              <Subtitle2>Stay in touch with the Holy Spirit and be inspired with every moment.</Subtitle2>
            </SpreadOut>
            {isMobile && false && <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  //setValue(newValue);
                }}
              >
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
              </BottomNavigation>
              <div style={{ height: 50, padding: 5 }}>Help to keep the lights on and the application free for everyone!</div>
            </Paper>}
          </ThemeProvider>
        </main>
      </MuiTP>
    </>
  );
}
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
    try {

      let { fbclid, utm_content, dark }:
        { fbclid: string, utm_content: string, dark: number } = context.query as any;
      utm_content = utm_content || '';
      fbclid = fbclid || '';
      const ua = context.req.headers['user-agent'] || "";
      const botInfo = isbot({ ua });
      let isMobile = Boolean(ua.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      ))
      let host = context.req.headers.host || "";
      var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let fresh = false;

      const recordEvent = async (sessionid: string, name: string, params: string) => {
        try {
          const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v41/findexar/record-event?name=${encodeURIComponent(name)}&sessionid=${encodeURIComponent(sessionid)}&params=${encodeURIComponent(params)}`;
          await fetch(url);
        }
        catch (e) {
          console.log("recordEvent", e);
        }
      };
      let startoptions = context.req.session?.options || null;
      ``
      if (!startoptions) {
        var randomstring = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        startoptions = {
          sessionid: randomstring(),
          dark: -1,
        }
        context.req.session.options = startoptions;
        await context.req.session.save();
      }
      let options: Options = startoptions;
      if (!options.sessionid) {
        options.sessionid = randomstring();
      }

      let sessionid = options.sessionid;
      // let sessionid = getCookie('sessionid', { req: context.req, res: context.res });


      if (!botInfo.bot) {
        try {
          await recordEvent(sessionid, `ssr-prayer${fresh ? '-init' : ''}`, `{"fbclid":"${fbclid}","ua":"${ua}","utm_content":"${utm_content}"}`);
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
          //sessionid,
          options,
          fbclid,
          utm_content,
          isbot: botInfo.bot,
          isfb: botInfo.fb || fbclid ? 1 : 0,
          //dark: dark || 0,
          t1: 0,
          isMobile
        }
      }

    } catch (x) {
      console.log("FETCH SSR PROPS ERROR", x);
      context.res.statusCode = 503;
      return {
        props: { error: 503 }
      }
    }
  })

