<template>
  <ion-page>
    <Header />
    <ion-content>
      <Answers
        v-for="question in QuestionsAnswers"
        :key="question.id"
        :question="question"
        type="questions_bank"
        @mark="getQuestionsBankAnswers()"
      ></Answers>
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
import Answers from "@/components/Answers.vue";

export default defineComponent({
  name: "QuestionsBankAnswers",
  components: {
    Header,
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    Answers,
  },
  setup() {
    const router = useRouter();
    const stage = router.currentRoute.value.params.stage;
    const term = router.currentRoute.value.params.term;
    const student_id = router.currentRoute.value.params.student_id;
    const store = useStore();
    const token = localStorage.getItem("token") || "";
    const QuestionsAnswers = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getQuestionsBankAnswers();
    });

    const getQuestionsBankAnswers = () => {
      fetch(
        `${BaseUrl}/questions/teacher/answers/${stage}/${term}/${student_id}`,
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
      stage,
      getQuestionsBankAnswers,
    };
  },
});
</script>
<style></style>
