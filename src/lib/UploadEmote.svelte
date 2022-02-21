<script>
    import { mutation } from '@urql/svelte';
    import { replace, link } from 'svelte-spa-router';


    export let passedDir;
    export let dirQuery; // to rexecute the uploaded emotes

    console.log("passedDir is " + passedDir);
    let emoteName = '';
    let emoteDirectory = '';
    let emoteFile;
    let emoteType;

    console.log('hi');
 // only show user dirs if the user is an admin

 // seems there's no other way to do it
    const uploadEmoteMutationStandard = mutation({  query: `
        mutation($emoteDirectory: UUID!, $slug: String!, $file: Upload!) {
            uploadEmote(dirUuid: $emoteDirectory, emoteType: STANDARD, slug: $slug, emoteFile: $file) {
                uuid
                slug
            }
        }`});
    const uploadEmoteMutationSticker = mutation({  query: `
        mutation($emoteDirectory: UUID!, $slug: String!, $file: Upload!) {
            uploadEmote(dirUuid: $emoteDirectory, emoteType: STICKER, slug: $slug, emoteFile: $file) {
                uuid
                slug
            }
        }`});

    async function uploadEmote() {
        console.log("uploading emote");
        console.log(emoteFile[0]);
        var opts = {
            emoteDirectory: emoteDirectory ? emoteDirectory : passedDir,
            file: emoteFile[0],
            slug: emoteName,
            emoteFile
        }

        console.log(emoteType)
        if (emoteType == "STANDARD") {
            await uploadEmoteMutationStandard(opts);
        }
        else if (emoteType == "STICKER") {
            await uploadEmoteMutationSticker(opts);
        }

        window.location.reload(true);

    }

    // query(dirs);
</script>

<div>
    <h4>Upload Emote</h4>
    <form
        on:submit|preventDefault={() => { uploadEmote() }}>
        <div class="emotes-form-group">
            <label for="domain">Name:</label>
            <input bind:value={emoteName}>
        </div>
        {#if !passedDir}
            <div class="emotes-form-group">
                <label for="token">Directory:</label>
                <input bind:value={emoteDirectory}>
            </div>
        {/if}
        <div class="emotes-form-group">
            <label for="emoteType">Emote Type:</label>
            <select bind:value={emoteType}>
                <option value="STANDARD">Standard</option>
                <option value="STICKER">Sticker</option>
            </select>
        </div>
        <div class="emotes-form-group">
            <input type="file" accept='image/*' bind:files={emoteFile}>
        </div>
        <div class="emotes-form-group">
            <input type="submit" value="Upload">
        </div>
    </form>
</div>

<style lang="scss">
</style>
