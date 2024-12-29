<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" color="light">
      <ion-card>
        <ion-card-content>
          <ion-select
            label="مراحل الدراسية"
            label-placement="stacked"
            placeholder="اختر مرحلة الدراسية"
            dir="rtl"
            v-model="stage"
          >
            <ion-select-option
              v-for="s in academicStages"
              :key="s.id"
              :value="s.id"
            >
              {{ s.grade_name }}
            </ion-select-option>
          </ion-select>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-content>
          <ion-select
            label="فصول الدراسية"
            label-placement="stacked"
            placeholder="اختر فصل دراسي"
            dir="rtl"
            v-model="term"
          >
            <ion-select-option v-for="t in terms" :key="t.id" :value="t.id">
              {{ t.term_name }}
            </ion-select-option>
          </ion-select>
        </ion-card-content>
      </ion-card>
      <ion-button
        v-if="stage > 0 && term > 0"
        color="primary"
        expand="block"
        @click="showStudents(stage, term)"
        style="margin: 20px 10px"
      >
        <ion-icon slot="icon-only" :icon="searchOutlineIcon"></ion-icon>
        <p>الطلاب الذين حلوا بنك الأسئلة</p>
      </ion-button>
      <ion-button
        color="primary"
        expand="block"
        @click="openAddModal(!openAdd)"
        style="margin: 0 10px"
      >
        <ion-icon slot="icon-only" :icon="addCircleOutlineIcon"></ion-icon>
        <p style="margin-left: 10px">اضافة اسئلة</p>
      </ion-button>
      <QuestionConnect
        :Stage="stage"
        :Term="term"
        :questionList="QuestionsList"
        @formSubmitted="HandleSubmited"
      />
      <QuestionForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Question="question"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="HandleSubmited"
      />
      <Question
        v-for="question in questions"
        :key="question.id"
        :question="question"
        :listofquestions="QuestionsList"
        @add-to-list="HandleAddToList"
        @edit="HandleEdit"
        @delete="HandleDelete"
      />
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import Header from "@/components/Header.vue";
import Question from "@/components/Question.vue";
import QuestionForm from "@/components/forms/QuestionForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";
import QuestionConnect from "@/components/forms/QuestionConnect.vue";

import {
  IonPage,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonList,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonIcon,
} from "@ionic/vue";

import {
  createOutline,
  trashOutline,
  addCircleOutline,
  eyeOutline,
  searchOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "Questions",
  components: {
    Header,
    Question,
    QuestionForm,
    QuestionConnect,
    IonPage,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonList,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
    IonIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const academicStages = ref<Array<any>>([]);
    const terms = ref<Array<any>>([
      { id: 0, term_name: "كل الفصول" },
      { id: 1, term_name: "الفصل الدراسي الاول" },
      { id: 2, term_name: "الفصل الدراسي الثاني" },
      { id: 3, term_name: "لا يوجد مرحلة لها" },
    ]);
    const questions = ref<Array<any>>([]);
    const question = ref<object>({});
    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const addCircleOutlineIcon = addCircleOutline;
    const eyeOutlineIcon = eyeOutline;
    const searchOutlineIcon = searchOutline;
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const stage = ref<number>(0);
    const term = ref<number>(0);
    const QuestionsList = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getQuestions();
    });

    function HandleAddToList(questionId: number) {
      const index = QuestionsList.value.findIndex(
        (question) => question.id === questionId
      );

      if (index === -1) {
        QuestionsList.value.push({ id: questionId });
        return;
      }

      QuestionsList.value.splice(index, 1);
    }

    function getQuestions() {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/questions/all/${stage.value}/${term.value}`, {
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
          if (data) {
            academicStages.value = data.grades;
            questions.value = data.questions;
          }
        });
    }

    function openAddModal(isOpen: boolean) {
      openAdd.value = isOpen;
      edit.value = false;
    }

    function HandleDelete(questionId: number) {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/questions/${questionId}`, {
        method: "DELETE",
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
          if (data) {
            getQuestions();
          }
        });
    }

    function showStudents(stage: number, term: number) {
      if (stage === 0 || term === 0) {
        return;
      }

      router.push(`/questions/students/${stage}/${term}`);
    }

    function editQuestion() {
      edit.value = true;
      openAdd.value = true;
    }

    function HandleEdit(q: any) {
      question.value = q;
      editQuestion();
    }

    function HandleSubmited() {
      getQuestions();
    }

    watch(stage, (newValue) => {
      getQuestions();
    });
    watch(term, (newValue) => {
      getQuestions();
    });

    return {
      createOutlineIcon,
      trashOutlineIcon,
      addCircleOutlineIcon,
      eyeOutlineIcon,
      searchOutlineIcon,
      openAdd,
      edit,
      stage,
      academicStages,
      questions,
      question,
      QuestionsList,
      terms,
      term,
      openAddModal,
      HandleAddToList,
      getQuestions,
      HandleDelete,
      HandleSubmited,
      HandleEdit,
      showStudents,
    };
  },
});
</script>

<style>
.grid-container {
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px;
}

.table-header {
  font-weight: bold;
}

.header-cell,
.data-cell {
  padding: 8px;
  text-align: center;
}

.buttons {
  width: 100%;
  display: flex;
}
</style>
