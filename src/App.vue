<script setup>
  import { waitUntil } from '@vercel/functions';

  async function getBlog() {
    const res = await fetch('https://api.vercel.app/blog/1');
    return res.json();
  }

  const callback = (response) => {
    // This callback will be triggered when the user selects or login to
    // his Google account from the popup
    console.log("Handle the response", response)
  }
</script>

<script>
  export function GET(request) {
    return new Response(`Hello from ${process.env.VERCEL_REGION}`);
  }
</script>

<template>
  <GoogleLogin :callback="callback" />
  <button @click="getBlog">Get Blog</button>
</template>

<style scoped>
</style>