<template>
  <ion-page>
    <Header />
    <ion-content>
      <ion-card>
        <ion-card-content>
          <pre ref="preText" contenteditable="true">{{ plan }}</pre>
          <ion-button @click="SavePlan">حفظ</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
} from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "@/utils/BaseUrl";
export default defineComponent({
  name: "PlanDetails",
  components: {
    Header,
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const plan_id = router.currentRoute.value.params.plan_id;
    const plan = ref<string>("");
    const preText = ref<HTMLElement | null>(null);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getPlan();
    });

    const getPlan = () => {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/student/teacher/plan/${plan_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 401) {
            store.commit("logout");
            router.push("/login");
            return;
          }
          return response.json();
        })
        .then((data) => {
          plan.value = data.plan.plan;
        });
    };

    const SavePlan = () => {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/student/teacher/plan/${plan_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: preText.value?.innerHTML,
        }),
      })
        .then((response) => response.json())
        .then((data) => getPlan());
    };

    return {
      plan,
      preText,
      SavePlan,
    };
  },
});
</script>
<style>
pre {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
  white-space: pre-wrap;
  border-radius: 5px;
}
</style>
