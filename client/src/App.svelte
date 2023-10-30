<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Home from "./pages/Home/Home.svelte";
  import Login from "./pages/Login/Login.svelte";
  import Signup from "./pages/Signup/Signup.svelte";
  import Contact from "./pages/Contact/Contact.svelte";
  import Member from "./pages/MemberPage/MemberPage.svelte";
  import PrivateRoute from "./components/RouteProtection/PrivateRoute.svelte";
	import { user } from "./components/stores.js";


  function handleLogout() {
		$user = null;
	}

</script>



<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/contact">Contact</Link>
    <Link to="/memberpage">Member</Link>
    {#if $user != null}
    <h3>Welcome {$user.username}</h3>
    <button on:click={handleLogout}>Logout</button>
  {/if}
  
  </nav>
  <div>
    <Route path="/"><Home/></Route>
    <Route path="/login"><Login/></Route>
    <Route path="/signup"><Signup /></Route>
    <Route path="/contact"><Contact/></Route>
    <PrivateRoute path="/memberpage" let:location>
			<Member/>
		</PrivateRoute>
  </div>
</Router>

<slot></slot>