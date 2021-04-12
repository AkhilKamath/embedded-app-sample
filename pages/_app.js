import React from 'react';
import App from "next/app";
import Head from "next/head";
import { AppProvider } from '@shopify/polaris';
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { Provider } from '@shopify/app-bridge-react';
import ClientRouter from '../components/ClientRouter';



function MyProvider(props) {
  // const app = useAppBridge();

  // const client = new ApolloClient({
  //   fetch: userLoggedInFetch(app),
  //   fetchOptions: {
  //     credentials: "include",
  //   },
  // });

  const Component = props.Component;

  return (
    // <ApolloProvider client={client}>
      <Component {...props} />
    // </ApolloProvider>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, shopOrigin } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Loop Subscriptions</title>
          <meta charSet="utf-8" />
        </Head>
        <AppProvider i18n={translations}>
          <Provider
            config={{
              apiKey: API_KEY,
              shopOrigin,
              forceRedirect: true
          }}>
            <ClientRouter />
            <MyProvider Component={Component} {...pageProps} />
          </Provider>
        </AppProvider>
      </React.Fragment>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin : ctx.query.shop,
  }
}

export default MyApp;