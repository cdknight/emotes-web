
<script>
    import { operationStore, query } from '@urql/svelte';
    import { replace, link } from 'svelte-spa-router';

    console.log('hi');
 // only show user dirs if the user is an admin
    const dirs = operationStore(`
        query {
            allDirs {
                uuid
                slug
            }
        }
    `);

    query(dirs);
</script>

<div>
    <h1>Directory Overview</h1>
    {#if $dirs.fetching}
        <p>loading dirs</p>
    {:else if $dirs.error}
        <p>error loading dirs</p>
    {:else}
        <div class="dir-listing">
            {#each $dirs.data.allDirs as dir}
                <a href="/dir/{ dir.uuid }" use:link>
                    {dir.slug}
                </a>
            {/each}
        </div>
    {/if}
</div>

<style>
 .dir-listing {
     display: flex;
     flex-direction: column;
     justify-content: center;
 }
</style>
