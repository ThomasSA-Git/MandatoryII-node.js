<script>
  import Toasts from "../../components/toast/Toasts.svelte";
  import { addToast, user, role } from "../../components/stores.js";
  import { url } from "../../util/apiUrl";
  import { navigate } from "svelte-navigator";

  let dismissible = true;
  let timeout = 0;

  let username = "";
  let password = "";

  async function handleSubmit() {
    const loginData = {
      username,
      password,
    };

    try {
      const response = await fetch(url + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        // Handle successful login
        const userData = await response.json();
        $user = userData.username;
        $role = userData.role;
        localStorage.setItem('user', JSON.stringify(userData));
        // Redirect depending on role
        if ($role === "admin") {
          navigate("/adminpage");
        } else {
          navigate("/memberpage");
        }
      } else {
        // Handle failed login
        const errorData = await response.json();
        // make the below a toast instead
        const errorMessage =
          errorData.error || "Login failed. Please check your credentials.";
        console.log(errorMessage);
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
        username = "";
        password = "";
        
      }
    } catch (error) {
      console.log(error);
      // make toast for the below as well
      addToast({
        message: error,
        type: "error",
        dismissible,
        timeout,
      });
      username = "";
      password = "";
    }
  }

  function navigateToResetPassword() {
    navigate("/resetpassword");
  }
</script>

<Toasts />

<h1>Login</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="username">Username:</label>
  <input type="text" id="username" bind:value={username} />

  <label for="password">Password:</label>
  <input type="password" id="password" bind:value={password} />

  <button type="submit">Login</button>
</form>
<button on:click={navigateToResetPassword}>Forgot Password?</button>
