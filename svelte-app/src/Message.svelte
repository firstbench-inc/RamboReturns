<script>
export let message;
export let sender;
const messageClass=message.who === sender ?'sent':'recieved';
const avatar= `https://avatars.dicebear.com/api/human/${message.who}.svg`;
const ts=new Date(message.when);
</script>
<div> class={`message ${messageClass}`}
<img src={avatar} alt="avatar"/>
<div class="message-text">
<p>{message.what}</p>
<time>{ts.toLocaleTimeString()}</time>
</div>
</div>