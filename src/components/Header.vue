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
<script>
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonImg,
} from "@ionic/vue";

export default {
  name: "Header",
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonImg,
  },
  data() {
    return {};
  },
};
</script>
