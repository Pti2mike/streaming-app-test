<template>
    <div>
        <Navbar/>
        <nuxt/>
    </div>
</template>

<script>
    import Navbar from "../components/NavBar.vue";
    export default {
        components: {
            Navbar,
        }
    }
</script>