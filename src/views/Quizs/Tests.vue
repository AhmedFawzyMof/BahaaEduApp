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
      <ion-button
        color="primary"
        expand="block"
        @click="openAddModal(!openAdd)"
        style="margin: 0 10px"
      >
        <ion-icon slot="icon-only" :icon="addCircleOutlineIcon"></ion-icon>
        <p style="margin-left: 10px">اضافة اختبار</p>
      </ion-button>
      <TestForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Test="cureentTest"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="getTests"
      />
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الاختبارات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <DataTable
            Type="test"
            :Data="tests"
            :RefReshFunc="getTests"
            :Grades="academicStages"
            :Terms="terms"
            :Edit="edit"
            @edit="editTest"
          />
          <ion-infinite-scroll @ionInfinite="ionInfinite">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-card-content>
      </ion-card>
      <ion-card dir="rtl" v-else style="height: 80%">
        <ion-card-content style="height: 100%">
          <div class="noData">
            <p>الرجاء تحديد المرحلة الدراسية لإظهار البيانات</p>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import Header from "@/components/Header.vue";
import TestForm from "@/components/forms/TestForm.vue";
import DataTable from "@/components/DataTable.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";

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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";

import {
  createOutline,
  trashOutline,
  addCircleOutline,
  eyeOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "Tests",
  components: {
    Header,
    TestForm,
    DataTable,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const academicStages = ref<Array<any>>([]);
    const tests = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const cureentTest = ref<any>({});

    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const addCircleOutlineIcon = addCircleOutline;
    const eyeOutlineIcon = eyeOutline;

    const terms = ref([
      { id: 1, term_name: "الاول" },
      { id: 2, term_name: "الثاني" },
      { id: 3, term_name: "لا يوجد" },
    ]);

    const getTests = async () => {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/tests/getall/${stage.value}/${limit.value}`, {
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

            if (tests.value.length === 0) {
              tests.value = data.tests;
            }

            if (tests.value.length === 30 || tests.value.length > 30) {
              tests.value.push(...data.tests);
            }

            if (data.tests.length === 0) {
              return;
            }
          }
        });
    };

    const grade = (id: number) => {
      const stage = academicStages.value.find((stage) => stage.id === id);
      return stage ? stage.grade_name : "";
    };

    const term = (id: number) => {
      const term = terms.value.find((term) => term.id === id);
      return term ? term.term_name : "";
    };

    const openAddModal = (isOpen: boolean) => {
      cureentTest.value = {};
      edit.value = false;
      openAdd.value = isOpen;
    };

    const editTest = (data: any) => {
      edit.value = data.edit;
      cureentTest.value = data.edit ? data.instace : {};
      openAdd.value = data.edit;
    };

    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (tests.value.length < 30) {
        ev.target.disabled = true;
        return;
      }
      limit.value += 30;
      getTests();
      setTimeout(() => ev.target.complete(), 500);
    };

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getTests();
    });

    watch(stage, getTests);
    watch(limit, getTests);

    return {
      academicStages,
      tests,
      stage,
      limit,
      openAdd,
      edit,
      cureentTest,
      createOutlineIcon,
      trashOutlineIcon,
      addCircleOutlineIcon,
      eyeOutlineIcon,
      terms,
      getTests,
      grade,
      term,
      openAddModal,
      editTest,
      ionInfinite,
    };
  },
});
</script>
