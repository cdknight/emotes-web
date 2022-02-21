
<script>
    import { operationStore, query } from '@urql/svelte';
    import { replace, link } from 'svelte-spa-router';
    import { getContext } from 'svelte';

    console.log('hi');
 // only show user dirs if the user is an admin

    let dirs = null;
    async function fetchData() {
        console.log(JSON.stringify(tokenUser));
        if (tokenUser.data.tokenUser.administrator) {
            dirs = operationStore(`
                query {
                    allDirs {
                        uuid
                        slug
                    }
                }
            `);

        } else {
            dirs = operationStore(`
                query {
                    tokenUser {
                        dirs {
                            uuid
                            slug
                        }
                    }
                }
            `);
        }

        query(dirs)
        return dirs;
    }
    const tokenUser = operationStore(`
        query {
            tokenUser {
                uuid
                username
                administrator
            }
        }
    `);

    function visibleDirs() {
        if ($tokenUser.data.tokenUser.administrator) {
            return dirs.data.allDirs;
        }
        return dirs.data.tokenUser.dirs;
    }

    query(tokenUser);

    // while (tokenUser.fetching) { console.log('waiting') }

</script>

<div>
    <h1>Directory Overview</h1>
    {#if $tokenUser.fetching}
        <p>loading user info</p>
    {:else if $tokenUser.errors}
        <p>failed loading dirs</p>
    {:else}
        {#await fetchData()}
        <p>loading dirs</p>
        {:then d }
            {#if $dirs.fetching}
                <p>loading dirs</p>
            {:else}
                <div class="dir-listing">
                    {#each visibleDirs() as dir}
                        <a href="/dir/{ dir.uuid }" use:link>
                            {dir.slug}
                        </a>
                    {/each}
                </div>
            {/if}
        {/await}
    {/if}
</div>

<style lang="scss">
 .dir-listing {
     display: flex;
     flex-direction: column;
     justify-content: center;

    a {
        @include link;
    }

    @media (max-width: 560px) {
        a {
            width: 100%;
        }
    }
 }
</style>
