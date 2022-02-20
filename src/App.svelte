<script lang="ts">
 import logo from './assets/svelte.png'
 import Login from './lib/Login.svelte'
 import Dir from './lib/Dir.svelte'
 import User from './lib/User.svelte'
 import Overview from './lib/Overview.svelte'
 import Router from 'svelte-spa-router'
 import { initClient, getClient } from '@urql/svelte';
 import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
  const routes = {
      '/login': Login,
      '/user/:uuid': User,
      '/dir/:uuid': Dir,
      '/': Overview,
  }

    if (!getClient()) {
        if (!localStorage.domain && !localStorage.token) {
            replace("/login")
        }
        else {
            const client = initClient({
                url: new URL('/api', localStorage.domain).href,
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
    }
</script>

<main>
    <Router {routes} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
