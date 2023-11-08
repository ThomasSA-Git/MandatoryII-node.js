<script>
  import Toasts from "../../components/toast/Toasts.svelte";
  import { addToast, BASE_URL } from "../../store/stores.js";
  import { navigate } from "svelte-navigator";

  let dismissible = true;
  let timeout = 0;

  let userNameForReset = "";

  let username = "";
  let secretToken = "";
  let newPassword = "";

  async function handleGetSecretToken() {
    try {
      const response = await fetch($BASE_URL + "/member/getSecretToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userNameForReset }),
        credentials: "include",
      });
      if (response.ok) {
        // Handle successful token mail
        const resetMessage = await response.json();
        addToast({
          message: resetMessage.message,
          type: "success",
          dismissible,
          timeout,
        });
        userNameForReset = "";
      } else {
        // Handle failed token mail
        const errorData = await response.json();
        // make the below a toast instead
        const errorMessage =
          errorData.error || "Reset failed. Please check your username.";
        console.log(errorMessage);
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
        userNameForReset = "";
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: error,
        type: "error",
        dismissible,
        timeout,
      });
      userNameForReset = "";
    }
  }

  async function handleReset() {
    const resetData = {
      username,
      secretToken,
      newPassword,
    };

    try {
      const response = await fetch($BASE_URL + "/member/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
        credentials: "include",
      });

      if (response.ok) {
        // Handle successful reset
        const resetSuccessData = await response.json();
        addToast({
          message: resetSuccessData.message,
          type: "success",
          dismissible,
          timeout,
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        // Handle failed reset
        const errorData = await response.json();
        // make the below a toast instead
        const errorMessage =
          errorData.error ||
          "Reset failed. Please check your username and token.";
        console.log(errorMessage);
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
        username = "";
        secretToken = "";
        newPassword = "";
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: error,
        type: "error",
        dismissible,
        timeout,
      });
      username = "";
      secretToken = "";
      newPassword = "";
    }
  }
</script>

<Toasts />

<h1>Reset your password</h1>

<div class="container">
  <div class="column">
<h2>Get token for reset</h2>
<p>Secret token will be sent to your mail. It will be active for 30min.</p>

<form on:submit|preventDefault={handleGetSecretToken}>
  <label for="usernameforreset">Username:</label>
  <input type="text" id="usernameforreset" bind:value={userNameForReset} />

  <button type="submit">Get token</button>
</form>
</div>
<div class="column">
<h2>Input username and secret token to reset password.</h2>
<form on:submit|preventDefault={handleReset}>
  <label for="username">Username:</label>
  <input type="text" id="username" bind:value={username} />

  <label for="secretToken">Secret token:</label>
  <input type="text" id="secretToken" bind:value={secretToken} />

  <label for="newPassword">New password:</label>
  <input type="password" id="newPassword" bind:value={newPassword} />

  <button type="submit">Reset password</button>
</form>
</div>
</div>
