<script lang="ts">
 import logo from './assets/svelte.png'
 import Login from './lib/Login.svelte'
 import Dir from './lib/Dir.svelte'
 import User from './lib/User.svelte'
 import Emote from './lib/Emote.svelte'
 import Overview from './lib/Overview.svelte'
 import Navbar from './lib/Navbar.svelte'

 import Router from 'svelte-spa-router'
 import { replace } from 'svelte-spa-router'

 import wrap from 'svelte-spa-router/wrap'
 import { initClient, getClient, query, operationStore } from '@urql/svelte';
 import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
 import { setContext } from 'svelte';
 function checkUser() {
     if (!localStorage.domain && !localStorage.token) {
         return false;
     }
     return true;
 }
 function makeClient(ev) {
     console.log("this was called")
 }
 function redirectLogin(ev) {
     replace('/login');
 }
 async function getTokenUser() {

 }
  const routes = {
      '/login': Login,
      '/user/:uuid': wrap({ component: User, conditions: [checkUser] }),
      '/emote/:uuid': wrap({ component: Emote, conditions: [checkUser] }),
      '/dir/:uuid': wrap({ component: Dir, conditions: [checkUser] }),
      '/': wrap({ component: Overview, conditions: [checkUser] }),
  }

 if (!getClient() && checkUser()) {
          let apiHref = new URL('/api', localStorage.domain).href
          console.log(apiHref)
          const client = initClient({
              url: apiHref,
              fetchOptions: () => {
                  return {
                      headers: {
                          Token: localStorage.token
                      }
                  };
              },
              exchanges: [multipartFetchExchange],
          });
   }


</script>

<main>
    <Navbar />
    <Router {routes} on:conditionsFailed={redirectLogin} on:routeLoaded={makeClient}/>
</main>

<style lang="scss">
</style>
