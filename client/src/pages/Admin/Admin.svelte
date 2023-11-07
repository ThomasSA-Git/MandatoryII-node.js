<script>
  import { url } from "../../util/apiUrl";
  import { onMount } from "svelte";
  import Toasts from "../../components/toast/Toasts.svelte";
  import { addToast } from "../../components/stores.js";

  let members = [];
  let dismissible = true;
  let timeout = 0;

  onMount(async () => {
    try {
      const response = await fetch(url + "admin/getMembers", {
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Failed getting user data. Please check your credentials.";
        addToast({
          message: errorMessage,
          type: "error",
          dismissible,
          timeout,
        });
      }

      const result = await response.json();
      members = result.data;
    } catch (error) {
      addToast({
        message: error,
        type: "error",
        dismissible,
        timeout,
      });
    }
  });
</script>

<Toasts />

<h1>Welcome admin</h1>

<h2>List of members</h2>

{#each members as member}
  <p><strong>Username: </strong>{member.username}</p>
  <p><strong>Email: </strong>{member.email}</p>
  <p><strong>Role: </strong>{member.role}</p>
  {#if member.address != undefined}
    <p><strong>Street: </strong>{member.address.streetname}</p>
    <p><strong>Email: </strong>{member.address.cityname}</p>
    <p><strong>Role: </strong>{member.address.zipcode}</p>
  {/if}
  <br />
{/each}
