import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
// import fs from 'fs';
// import { Session } from '@shopify/shopify-api/dist/auth/session';

dotenv.config();
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.SHOPIFY_APP_URL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,//will get deprecated in Oct21
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
  // SESSION_STORAGE: sessionStorage,

});


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

//fetch active shops list from DB
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      afterAuth(ctx) {
        console.log('After auth the ctx is', ctx);
        const { shop, scope } = ctx.state.shopify;
        //update active shops in db as well
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        ctx.redirect(`/?shop=${shop}`);
      },
    }),
  );


  //middlewears
  const handleRequest = async (ctx) => {
    console.log('Context inside handleRequest (handles statc, webhook and any * path is', ctx);
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  // const checkAuthnticated = async (ctx, next) => {
  //   console.log('Context inside check authenticated', ctx);
  //   const shop = ctx.query.shop;

  //   if(ACTIVE_SHOPIFY_SHOPS[shop] === undefined)
  //   {
  //     ctx.redirect(`/auth?shop=${shop}`);
  //   }
  //   else
  //   {
  //     next();
  //   }
  // }


  //some default required routes
  router.get("/", async (ctx) => {
    console.log('Context from koa router .get / ', ctx);
    const shop = ctx.query.shop;
    console.log('ctx query shop inside GET /',shop);
    if(ACTIVE_SHOPIFY_SHOPS[shop] === undefined)
    {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  // router.get("/", checkAuthnticated, handleRequest);
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions
  
  server.use(router.allowedMethods());// can implent boom to have better error throws
  server.use(router.routes())

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
