

<script>
    import { initClient, getClient, operationStore, query, mutation } from '@urql/svelte';
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

    const deleteDir = mutation({  query: `
        mutation($uuid: UUID!) {
            deleteDir(uuid: $uuid) }`});
    function deleteDirectory() {
        if (window.confirm("Are you sure?")) {
            console.log(deleteDir({ uuid: params.uuid }));
        }
    }

    query(dir);
</script>

<div>
    {#if $dir.fetching}
        <p>loading dir</p>
    {:else if $dir.error}
        <p>error loading dir</p>
    {:else}
        <div class="dir-detail">
            <h1>Directory '{$dir.data.dir.slug}'</h1>
                <code>uuid: {$dir.data.dir.uuid}</code>
            <h4>Owners</h4>
            <div class="dir-detail-owners">
                {#each $dir.data.dir.users as user}
                    <a href="/user/{ user.uuid }" use:link>{ user.username }</a>
                {/each}
            </div>
            <h4>Emotes</h4>
            <div class="dir-detail-emotes">
                {#each $dir.data.dir.emotes as emote}
                    <a class="emote-link" href="/emote/{ emote.uuid }" use:link>
                        <img src="{ new URL("/" + $dir.data.dir.slug + "/" + emote.slug, client.url).href }">
                    </a>
                {/each}
            </div>
            <UploadEmote passedDir={$dir.data.dir.uuid} dirQuery={$dir} />
            <button class="delete-resource" on:click="{deleteDirectory}">Delete Directory</button>
        </div>
    {/if}
</div>

<style lang="scss">
    .dir-detail {
        .dir-detail-header {
            display: flex;
            align-items: center;

            code { // not first child?
                margin-left: 10px;
            }
        }
        .dir-detail-owners {
            display: flex;
            flex-direction: column;
        }
        .emote-link {
            text-decoration: none;
        }
    }
</style>
