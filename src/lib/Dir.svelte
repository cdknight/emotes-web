

<script>
    import { initClient, getClient, operationStore, query } from '@urql/svelte';
    import { replace, link } from 'svelte-spa-router';
    import UploadEmote from './UploadEmote.svelte';

    export let params = {};
    console.log(params.uuid);
    const client = getClient();
    const dir = operationStore(`
        query($uuid: UUID!) {
            dir(uuid: $uuid){
                uuid
                slug
                emotes {
                  uuid
                  slug
                  emoteType
                }
                users {
                  uuid
                  username
                }
            }
        }`, { uuid: params.uuid });

    query(dir);
</script>

<div>
    <h1>Directory </h1>
    {#if $dir.fetching}
        <p>loading dir</p>
    {:else if $dir.error}
        <p>error loading dir</p>
    {:else}
        <div class="dir-detail">
            <div class="dir-detail-header">
                <h3>Name: {$dir.data.dir.slug}
                </h3>
                <code>uuid: {$dir.data.dir.uuid}</code>
            </div>
            <h4>Directory Owners</h4>
            <div class="dir-detail-owners">
                {#each $dir.data.dir.users as user}
                    <a href="/user/{ user.uuid }" use:link>{ user.username }</a>
                {/each}
            </div>
            <h4>Directory Emotes</h4>
            <div class="dir-detail-emotes">
                {#each $dir.data.dir.emotes as emote}
                    <img src="{ new URL("/" + $dir.data.dir.slug + "/" + emote.slug, client.url).href }">
                {/each}
            </div>
            <UploadEmote passedDir={$dir.data.dir.uuid} />
        </div>
    {/if}
</div>

<style lang="scss">
    .dir-detail {
        .dir-detail-header {
            display: flex;
            justify-content: center;
            align-items: center;

            code { // not first child?
                margin-left: 10px;
            }
        }
    }
</style>
