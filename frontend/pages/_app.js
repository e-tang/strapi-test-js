import App from "next/app"
import Head from "next/head"
import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import { getStrapiMedia } from "utils/media"
import { getGlobalData } from "utils/api"
import "@/styles/index.css"

const MyApp = ({ Component, pageProps }) => {
  // Extract the data we need
  const { global } = pageProps
  if (global == null) {
    console.error("No global data found")
    return <ErrorPage statusCode={404} />
  }

  // console.debug("From MyApp:")
  // console.debug(JSON.stringify(global))

  const { metadata, favicon, metaTitleSuffix } =
    global.attributes || global.data.attributes

  return (
    <>
      {/* Favicon */}
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(favicon.data.attributes.url)}
        />
      </Head>
      {/* Global site metadata */}
      <DefaultSeo
        titleTemplate={`%s | ${metaTitleSuffix}`}
        title="Page"
        description={metadata.metaDescription}
        openGraph={{
          images: metadata.shareImage.data
            ? Object.values(metadata.shareImage.data.attributes.formats).map(
                (image) => {
                  return {
                    url: getStrapiMedia(image.url),
                    width: image.width,
                    height: image.height,
                  }
                }
              )
            : null,
        }}
        twitter={{
          cardType: metadata.twitterCardType,
          handle: metadata.twitterUsername,
        }}
      />
      {/* Display the content */}
      <Component {...pageProps} />
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (appContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  const globalLocale = await getGlobalData(appContext.router.locale)
  console.log("globalLocale:", JSON.stringify(globalLocale))
  return {
    ...appProps,
    pageProps: {
      global: globalLocale,
    },
  }
}

export default MyApp
