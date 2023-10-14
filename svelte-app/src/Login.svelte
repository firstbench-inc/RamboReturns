<script>
    import {user} from './user'
    let username;
    let password;

    function login(){
        user.auth(username, password, ({err}) => err && alert(err))
    }

    function signup(){
        user.create(username, password, ({err}) =>{
            if (err){
                alert(err)
            }
            else
            {
                login();
            }
        });
    }
</script>

<label for="username">username</label>
<input type="text" class="user-input" bind:value={username} minlength="3" maxlength="50">

<label for="password">password</label>
<input type="password" class="user-input" bind:value={password} minlength="8" maxlength="50">
<button class="login" on:click={login}>Login</button>
<button class="singup" on:click={signup}>Sign up</button>