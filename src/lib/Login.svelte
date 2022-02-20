<script>
    import { initClient, getClient } from '@urql/svelte';
    import { push } from 'svelte-spa-router';

    let domain = '';
    let token = '';

    const login = async () => {
        localStorage.domain = domain;
        localStorage.token = token;

        push("/")
    }
</script>

<form
    on:submit|preventDefault={() => { login() }}>
    <div class="emotes-form-group">
        <label for="domain">Domain:</label>
        <input bind:value={domain}>
    </div>
    <div class="emotes-form-group">
        <label for="token">Token:</label>
        <input bind:value={token}>
    </div>
    <div class="emotes-form-group">
        <input type="submit" value="Submit">
    </div>
</form>

<style lang="scss">
 .emotes-form-group {
     margin-bottom: 10px;
 }
</style>
