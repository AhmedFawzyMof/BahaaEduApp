<template>
  <ion-page>
    <Header />
    <ion-content>
      <Answers
        v-for="question in QuestionsAnswers"
        :key="question.id"
        :question="question"
        :id="String(public_test_id)"
        type="public_test"
        @mark="getPublicTestAnswers()"
      ></Answers>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import { IonPage, IonContent } from "@ionic/vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "@/utils/BaseUrl";
import Answers from "@/components/Answers.vue";

export default defineComponent({
  name: "PublicTestAnswers",
  components: {
    Header,
    IonPage,
    IonContent,
    Answers,
  },
  setup() {
    const router = useRouter();
    const public_test_id = router.currentRoute.value.params.test_id;
    const student_id = router.currentRoute.value.params.student_id;
    const store = useStore();
    const token = localStorage.getItem("token") || "";
    const QuestionsAnswers = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getPublicTestAnswers();
    });

    const getPublicTestAnswers = () => {
      fetch(
        `${BaseUrl}/public_tests/techer/answers/${public_test_id}/${student_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 401) {
            store.commit("logout");
            router.push("/login");
            return;
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          QuestionsAnswers.value = data.answers;
        });
    };

    return {
      QuestionsAnswers,
      public_test_id,
      getPublicTestAnswers,
    };
  },
});
</script>
