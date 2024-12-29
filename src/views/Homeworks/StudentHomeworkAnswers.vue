<template>
  <ion-page>
    <Header />
    <ion-content>
      <ion-card dir="rtl">
        <ion-card-content>
          <div class="public">
            <p>تم نشره: {{ published ? "نعم" : "لا" }}</p>
            <ion-button
              @click="Publish('homework', Number(homework_id), published)"
              >{{ published ? "الغاء نشره" : "نشره" }}</ion-button
            >
          </div>
        </ion-card-content>
      </ion-card>
      <Answers
        v-for="question in QuestionsAnswers"
        :key="question.id"
        :question="question"
        :id="String(homework_id)"
        type="homework"
        @mark="getHomeworkAnswers()"
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
import PublishResult from "@/utils/PublishResult";

export default defineComponent({
  name: "HomeworkAnswers",
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
    const homework_id = router.currentRoute.value.params.homework_id;
    const student_id = router.currentRoute.value.params.student_id;
    const store = useStore();
    const token = localStorage.getItem("token") || "";
    const QuestionsAnswers = ref<Array<any>>([]);
    const published = ref<boolean>(false);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getHomeworkAnswers();
    });

    const getHomeworkAnswers = () => {
      fetch(
        `${BaseUrl}/homeworks/techer/answers/${homework_id}/${student_id}`,
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
          QuestionsAnswers.value = data.answers;
          published.value = data.published.public;
        });
    };

    const Publish = (type: string, id: number, publish: boolean) => {
      PublishResult(
        type,
        id,
        String(student_id),
        publish,
        store,
        router,
        getHomeworkAnswers
      );
    };

    return {
      QuestionsAnswers,
      homework_id,
      published,
      getHomeworkAnswers,
      Publish,
    };
  },
});
</script>
<style>
.public {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
