<script>
    import Login from './Login.svelte';
    import Message from './Message.svelte';
    import { onMount } from 'svelte';
    import { username, user } from '/user';
    import debounce from 'lodash.debounce';
    import GUN from 'gun';
    import * as sodium from 'libsodium-wrappers';

    const db = GUN();

    let newMessage;
    let messages =[];
    
    let scrollBottom;
    let lastScrollTop;
    let canAutoScroll = true;
    let unreadMessages = false;

    function autoScroll(){
        setTimeout(() => {
            scrollBottom?.scrollIntoView({behaviour:'auto'})
        }, 50);

        unreadMessages = false;
    }

    function watchScroll(e){
        canAutoScroll = (e.target.scroolTop || Infinity) > lastScrollTop;
        lastScrollTop = e.target.scroolTop;
    }

    const generateRandomKey = async () => {
        await sodium.ready;
        return sodium.crypto_secretbox_keygen();
        };

        // Function to encrypt a message with a symmetric key
    const encryptMessage = async (message, key) => {
        await sodium.ready;

        // Generate a random nonce
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        // Encrypt the message
        const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);

        return { ciphertext, nonce };
        };

        // Function to decrypt an encrypted message with a symmetric key
    const decryptMessage = async (ciphertext, nonce, key) => {
        await sodium.ready;

        // Decrypt the message
        try {
            const decryptedMessage = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
            return decryptedMessage;
        } catch (error) {
            throw new Error('Decryption failed: Invalid key or ciphertext');
        }
    };

    $: debouncedWatchScroll = debounce(watchScroll, 1000)

    onMount(() =>{
        var match = {
            '.':{
                '>': new Date (+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(),
            }, 
            '-' : 1.
        };
    
    db.get('chat')
    .map(match)
    .once(async(data, id) =>{
        if (data) {
            const key = 'gun-chat';
            var message = {
                who: await db.user(data).get('alias'), 
                what: (await SEA.decrypt(data.what, key)) + '', 
                when: GUN.state.is(data, 'what'),
            };

        if (message.what){
            messages = [...messages.slice(-100), message].sort((a, b) => a.when - b.when);
            if(canAutoScroll){
                autoScroll();
            }
            else{
            unreadMessages = true;
            }
        }

        }
    })})
    async function sendMessage() {
        const secret = await SEA.encrypt(newMessage, 'gun-chat');
        const message = user.get('all').set({ what: secret });
        const index = new Date().toISOString();
        db.get('chat').get(index).put(message);
        newMessage = '';
        canAutoScroll = true;
        autoScroll();
    }

</script>

<div class="container">
  {#if $username}
    <main on:scroll={debouncedWatchScroll}>
      {#each messages as message (message.when)}
        <Message {message} sender={$username} />
      {/each}

      <div class="dummy" bind:this={scrollBottom} />
    </main>

    <form on:submit|preventDefault={sendMessage}>
      <input type="text" placeholder="Type a message..." bind:value={newMessage} maxlength="100" />

      <button type="submit" disabled={!newMessage}>Send</button>
    </form>


    {#if !canAutoScroll}
    <div class="scroll-button">
      <button on:click={autoScroll} class:red={unreadMessages}>
        {#if unreadMessages}
          💬
        {/if}

        👇
      </button>
    </div>
   {/if}
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>