<script>
    import Toasts from "../../components/toast/Toasts.svelte";
    import { addToast } from "../../components/stores.js";
    import { url } from "../../util/apiUrl";
  
    let dismissible = true;
    let timeout = 0;
  
    let username = "";
    let password = "";
    let email = "";
  
    async function handleRegister() {
      const userData = {
        username,
        email,
        password
      };
  
      try {
        const response = await fetch(url + "auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include"
        });
  
        if (response.ok) {
          // Handle successful logiregistration
          // Make a toast and redirect after countdown
          addToast({
            message: "Registration successful",
            type: "success",
            dismissible,
            timeout,
          });
          username = "";
          email = "";
          password = "";
        } else {
          // Handle failed registration
          const errorData = await response.json();
    
        // make the below a toast instead
        const errorMessage =
          errorData.error || "Login failed. Please check your credentials.";
          addToast({ message: errorMessage, type: "error", dismissible, timeout });
          username = "";
          email = "";
          password = "";
        }
      } catch (error) {
        // make toast for the below as well
        //console.error("Login error:", error);
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
  
  <h1>Register new member</h1>
  
  <form on:submit|preventDefault={handleRegister}>
    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} />

    <label for="email">E-mail:</label>
    <input type="email" id="email" bind:value={email} />
  
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} />
  
    <button type="submit">Register</button>
  </form>
  