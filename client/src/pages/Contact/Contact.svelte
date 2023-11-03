<script>
  import Toasts from "../../components/toast/Toasts.svelte";
  import { addToast } from "../../components/stores.js";
  import { url } from "../../util/apiUrl";

  let dismissible = true;
  let timeout = 0;

  let name = "";
  let email = "";
  let message = "";

  async function handleSubmit() {
    const contactData = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch(url + "contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
        credentials: "include"
      });

      if (response.ok) {
        // Handle successful contact
        // Make a toast and redirect after countdown
        addToast({
          message: "Message sent successfully",
          type: "success",
          dismissible,
          timeout,
        });
        resetValues();
      } else {
        // Handle failed fetch
        const errorData = await response.json();
        // make the below a toast instead
        let errorMessage =
          errorData.message ||
          "Message submittance failed. Please try again later.";
        addToast({ errorMessage, type: "error", dismissible, timeout });
        resetValues();
      }
    } catch (error) {
      // make toast for the below as well
      console.error("Submit error:", error);
      addToast({
        message: "An unexpected error occurred. Please try again later.",
        type: "error",
        dismissible,
        timeout
      });
      resetValues();
    }
  }

  function resetValues() {
    name = "";
    email = "";
    message = "";
  }
</script>

<Toasts />

<h1>Contact</h1>

<form on:submit|preventDefault={handleSubmit}>
  <label for="name">Your name:</label>
  <input bind:value={name} name="name" placeholder="Your name" />
  
  <label for="email">Your Email:</label>
  <input bind:value={email} type="email" name="email" placeholder="Your email" />
  
  <label for="message">Message:</label>
  <textarea bind:value={message} name="message" cols="80" rows="10" placeholder="Message"></textarea>

  <button type="submit">Submit</button>
</form>
