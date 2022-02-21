<script>
    import { initClient, getClient, operationStore, query } from '@urql/svelte';
    import { replace, link } from 'svelte-spa-router';


    export let params = {};
    const client = getClient();

    const user = operationStore(`
        query($uuid: UUID!) {
            user(uuid: $uuid){
                uuid
                username
                dirs {
                  uuid
                  slug
                }
            }
        }`, { uuid: params.uuid });

    query(user);
</script>

<div>
    <h1>User</h1>
    {#if $user.fetching}
        <p>loading user</p>
    {:else if $user.error}
        <p>error loading user</p>
    {:else}
        <div class="user-detail">
            <div class="user-detail-header">
                <h3>Username: {$user.data.user.username}
                </h3>
                <code>uuid: {$user.data.user.uuid}</code>
            </div>
            <h4>User Directories</h4>
            <div class="user-detail-owners">
                {#each $user.data.user.dirs as dir}
                    <a href="/dir/{ dir.uuid }" use:link>{ dir.slug }</a>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .user-detail {
        .user-detail-header {
            display: flex;
            align-items: center;

            code { // not first child?
                margin-left: 10px;
            }
        }
    }
</style>
