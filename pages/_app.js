import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default MyApp;
