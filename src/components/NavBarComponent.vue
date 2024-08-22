<template>
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <RouterLink to="/">
                            <svg class="fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path
                                    d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                            </svg>
                            Voorpagina
                        </RouterLink>
                    </li>
                    <li><a>Voorspellen</a></li>
                    <li><a>Jouw pool 1</a></li>
                    <li>
                        <RouterLink :to="'/pool/0'">jouw pool 2 <div
                                class="avatar-group -space-x-6 rtl:space-x-reverse">
                                <div class="avatar">
                                    <div class="w-12">
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <div class="avatar">
                                    <div class="w-12">
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <div class="avatar">
                                    <div class="w-12">
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <div class="avatar">
                                    <div class="w-12">
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex-1">
            <a class="btn btn-ghost text-xl">Voetbal poule</a>
        </div>
        <div class="flex-none gap-2" v-if="user != none">
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img alt="Tailwind CSS Navbar component" :src="user.picture" />
                    </div>
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <RouterLink to="/login">Logout</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        user() {
            console.log(this.$store.state);
            return this.$store.state.userdata
        }
    }
}
</script>