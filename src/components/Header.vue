<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-img src="/logo.png" alt="logo" style="width: 150px"></ion-img>
      <ion-buttons slot="end">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
} from "@ionic/vue";

export default defineComponent({
  name: "Header",
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonImg,
  },
  setup() {
    return {};
  },
});
</script>
