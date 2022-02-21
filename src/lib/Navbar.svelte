<script>
    import { link, push, replace } from 'svelte-spa-router';
 function logout() {
     //logout
     localStorage.domain = '';
     localStorage.token = '';

     console.log("login")
     // window.location.href = "#/login"
 }
 function login() {
     //logout
     replace("/login")
 }
 function goHome() {
     push("/")
 }
</script>

<div class="emotes-navbar">
    <h2 class="action" on:click="{goHome}">emotes</h2>
    {#if !localStorage.domain && !localStorage.token}
    <h3 class="action" on:click="{login}">login</h3>
    {:else}
    <h3 class="action" on:click="{logout}">logout</h3>
    {/if}
</div>

<style lang="scss">
 .emotes-navbar {
     display: flex;
     align-items: center;

     h3 {
        margin-left: 10px;
        font-weight: 500;
        font-size: 1.1rem;
        margin-left: 10px;
        padding: 5px;
     }

     .action {

         text-decoration: none;
         color: black;
         transition: 0.2s;

         &:hover {
             background-color: #68e0e2;
             border-radius: 3px;
             cursor: pointer;
         }
     }
 }
</style>
