<script>
  import { user } from "../../components/stores";
  import { url } from "../../util/apiUrl";
  import { onMount } from "svelte";

  let members = [];

  onMount(async () => {
        const response = await fetch(url + "admin/getMembers", {
        credentials: "include"
      });
        const result = await response.json();
        members = result.data;
        console.log(members[0])
    });
</script>

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
    <br>
{/each}
