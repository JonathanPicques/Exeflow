<script lang="ts">
    import Logo from '../../widgets/Logo.svelte';
    import Navbar from '../../widgets/Navbar.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';

    let {data} = $props();
</script>

<svelte:head>
    <title>Exeflow - Validate email</title>
</svelte:head>

<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    {#if data.success}
        <h1>Account validated!</h1>
        <a href="/home">Start automating!</a>
    {/if}
    {#if data.error}
        <h1>There was an error while validating your account</h1>
        <p>{data.description}</p>
    {/if}
</main>

<style>
    main {
        gap: 1rem;
        display: flex;
        flex-grow: 1;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
</style>
