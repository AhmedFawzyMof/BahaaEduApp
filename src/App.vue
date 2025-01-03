<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu side="end" content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list" dir="rtl">
            <ion-list-header>Bahaa Education</ion-list-header>

            <ion-menu-toggle v-if="isAuthenticated">
              <ion-item
                v-for="link in listOfPages"
                router-direction="root"
                :router-link="link.url"
                lines="none"
                :detail="false"
                class="hydrated"
              >
                <ion-icon slot="start" :icon="link.icon"></ion-icon>
                <ion-label style="font-family: Cairo">{{
                  link.title
                }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/vue";

import {
  optionsOutline,
  peopleOutline,
  bookOutline,
  bookmarksOutline,
  videocamOutline,
} from "ionicons/icons";

interface Page {
  title: string;
  url: string;
  icon: string;
}

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.state.isAuthenticated);

    const listOfPages = ref<Page[]>([
      { title: "لوحة التحكم", url: "/dashboard", icon: optionsOutline },
      { title: "الطلاب", url: "/students", icon: peopleOutline },
      { title: "الواجبات", url: "/homeworks", icon: bookOutline },
      { title: "الاختبارات", url: "/tests", icon: bookOutline },
      { title: "الاختبارات العامة", url: "/publictests", icon: bookOutline },
      { title: "مراحل الدراسية", url: "/grades", icon: bookmarksOutline },
      { title: "اسئلة", url: "/questions", icon: bookmarksOutline },
      { title: "فيديوهات", url: "/videos", icon: videocamOutline },
    ]);

    onMounted(() => {
      store.commit("initializeStore");
      store.commit("isLoggedIn", router);
    });

    return {
      isAuthenticated,
      listOfPages,
    };
  },
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
