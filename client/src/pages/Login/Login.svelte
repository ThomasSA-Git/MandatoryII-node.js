<script>
  import Toasts from "../../components/toast/Toasts.svelte";
  import { addToast } from "../../components/stores.js";
  import { url } from "../../util/apiUrl";

  let dismissible = true;
  let timeout = 0;

  let username = "";
  let password = "";
  let errorMessage = "";

  async function handleSubmit() {
    const loginData = {
      username,
      password
    };

    try {
      const response = await fetch(url + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Handle successful login
        // Make a toast and redirect after countdown
        addToast({
          message: "Login successful",
          type: "success",
          dismissible,
          timeout,
        });
        username = "";
        password = "";
      } else {
        // Handle failed login
        const errorData = await response.json();
        // make the below a toast instead
        errorMessage =
          errorData.message || "Login failed. Please check your credentials.";
        addToast({ errorMessage, type: "error", dismissible, timeout });
        username = "";
        password = "";
      }
    } catch (error) {
      // make toast for the below as well
      console.error("Login error:", error);
      addToast({
        message: "An unexpected error occurred. Please try again later.",
        type: "error",
        dismissible,
        timeout,
      });
      username = "";
      password = "";
    }
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
