<script>
 import { mutation, query, operationStore, getClient } from '@urql/svelte'
 import { replace, link } from 'svelte-spa-router';
 let client = getClient();
 export let params = {};

 const emoteInfo = operationStore(`
query($emoteUuid: UUID!) {
  emote(uuid: $emoteUuid) {
    uuid
    emoteDirUuid
    slug
    images {
      uuid
      width
      height
    }
  }
}
 `, { emoteUuid: params.uuid });

 let dirInfo = null;
 async function fetchDirInfo() {
    dirInfo = operationStore(`
        query($dirUuid: UUID!) {
            dir(uuid: $dirUuid) {
                uuid
                slug
            }
        }
    `, { dirUuid: emoteInfo.data.emote.emoteDirUuid });
     await query(dirInfo);
 }

 const deleteEmote = mutation({ query: `
mutation($uuid: UUID!) {
  deleteEmote(uuid: $uuid)
}
 `});

 async function doDeleteEmote() {
    if (window.confirm("Are you sure?")) {
        await deleteEmote({ uuid: params.uuid });
        window.location.href = "#/dir/" + emoteInfo.data.emote.emoteDirUuid;
        window.location.reload(true);
    }
 }
 function sortedImageSizes() {
     return $emoteInfo.data.emote.images.map(x => [x.width, x.height]).sort(function(f, s) {
         return s[0] < f[0];
     });
 }

 query(emoteInfo);

</script>

<div>
{#if $emoteInfo.fetching}
    <p>loading emote info</p>
{:else if $emoteInfo.errors}
    <p>Failed to load emotes</p>
{:else}
    {#await fetchDirInfo()}
    {:then placeholder}
        {#if $dirInfo.fetching}
            <p>loading emote directory information</p>
        {:else if $dirInfo.errors}
            <p>failed to get dir info</p>
        {:else}
            <h1>Emote <code>/{ $dirInfo.data.dir.slug }/{ $emoteInfo.data.emote.slug }</code></h1>
            <div class="emote-images-listing">
                {#each sortedImageSizes() as image_width}
                    <div>
                        <img src="{
                                new URL("/" + $dirInfo.data.dir.slug + "/" + $emoteInfo.data.emote.slug + "/" + image_width[0], client.url).href
                            }">
                        <button class="delete-resource">Delete</button>
                        <code>{ image_width[0] }x{ image_width[1] }</code>
                    </div>
                {/each}
            </div>
            <div class="vbox">
                <button class="add-resource">Add Image</button>
                <button class="delete-resource" on:click="{doDeleteEmote}">Delete Emote</button>
            </div>
        {/if}
    {/await}
{/if}
</div>

<style lang="scss">
 .emote-images-listing {
     display: flex;
     align-items: baseline;
     & > :not(:first-child) {
         margin-left: 0.5rem;
     }

     div {
         display: flex;
         flex-direction: column;
         border: 2px solid black;
         border-radius: 3px;
         padding: 10px;
         code {
             align-self: end;
         }
     }
     .delete-resource {
         width: 100%;
         margin-top: 10px;
         &:hover {
            cursor: not-allowed;
         }
     }
 }

  .add-resource:hover {
      cursor: not-allowed;
  }
 .vbox {
     margin-top: 10px;
 }
</style>
