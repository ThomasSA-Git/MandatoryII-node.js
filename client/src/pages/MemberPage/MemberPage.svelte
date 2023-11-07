<script>
  import { onMount } from "svelte";
  import { addToast, user } from "../../components/stores.js";
  import { url } from "../../util/apiUrl";
  import Toasts from "../../components/toast/Toasts.svelte";

  let dismissible = true;
  let timeout = 0;

  const member = $user;

  let streetname = "";
  let cityname = "";
  let zipcode = "";

  onMount(async () => {
    try {
      const response = await fetch(`${url}member/getMember`, {
        credentials: "include",
      });

      if (response.ok) {
        const memberData = await response.json();
        console.log("Member Data:", memberData);
        streetname = memberData.user.address?.streetname || "";
        cityname = memberData.user.address?.cityname || "";
        zipcode = memberData.user.address?.zipcode || "";
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch member data.";
        console.error(errorMessage);
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
        streetname = "";
        cityname = "";
        zipcode = "";
      }
    } catch (error) {
      // Handle other errors
      console.error("Error:", error);
      addToast({
        message: "An error occurred.",
        type: "error",
        dismissible,
        timeout,
      });
      streetname = "";
      cityname = "";
      zipcode = "";
    }
  });

  async function handleUpdateAddress() {
    try {
      const updateData = {
        username: member,
        address: {
          streetname,
          cityname,
          zipcode,
        },
      };

      const response = await fetch(url + "member/updateAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      if (response.ok) {
        const successMessage = await response.json();
        addToast({
          message: successMessage.message,
          type: "success",
          dismissible,
          timeout,
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to update address.";
        console.error(errorMessage);
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      addToast({
        message: "An error occurred.",
        type: "error",
        dismissible,
        timeout,
      });
    }
  }
</script>

<Toasts />

<h1>Hello {member}</h1>
<p>Here you can see your personal info and update your address.</p>

<form on:submit|preventDefault={handleUpdateAddress}>
  <label for="streetname">Street:</label>
  <input type="text" id="streetname" bind:value={streetname} />

  <label for="cityname">City:</label>
  <input type="text" id="cityname" bind:value={cityname} />

  <label for="zipcode">Zip code:</label>
  <input type="text" id="zipcode" bind:value={zipcode} />

  <button type="submit">Submit new address</button>
</form>
