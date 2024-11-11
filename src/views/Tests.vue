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
      >
        <ion-icon slot="icon-only" :icon="addCircleOutlineIcon"></ion-icon>
        <p style="margin-left: 10px">اضافة اختبار</p>
      </ion-button>
      <TestForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Test="test"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="getTests"
      />
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الاختبارات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid v-if="tests.length > 0">
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 900px"
                  >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >الاسم</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >الوقت</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 150px"
                      >تاريخ نهاية الامتحان</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >المرحلة</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >فترة/ترم</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 150px"
                    ></ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(test, index) in tests"
                    :key="index"
                    :style="`${
                      index === tests.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 900px"
                  >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >{{ test.test_name }}</ion-col
                    >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >{{ test.created_at }}</ion-col
                    >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 150px"
                      >{{ test.expire_date }}</ion-col
                    >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >{{ grade(test.grade_id) }}</ion-col
                    >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                      >{{ term(test.term_id) }}</ion-col
                    >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 150px"
                    >
                      <ion-button @click="editTest(test, !edit)">
                        <ion-icon :icon="createOutlineIcon" />
                      </ion-button>
                      <ion-button color="danger" @click="deleteTest(test.id)">
                        <ion-icon :icon="trashOutlineIcon" />
                      </ion-button>
                      <ion-button color="secondary">
                        <ion-icon :icon="eyeOutlineIcon" />
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>

                <div class="noData" v-else>
                  <p>لا توجد بيانات حتى الان</p>
                </div>
              </div>
            </div>
          </div>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../utils/BaseUrl";

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
} from "ionicons/icons";

export default defineComponent({
  name: "Tests",
  components: {
    Header,
    TestForm,
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
    const tests = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const test = ref<any>({});

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
            tests.value = data.tests;
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
      openAdd.value = isOpen;
      test.value = {};
    };

    const editTest = (testData: any, isEdit: boolean) => {
      edit.value = isEdit;
      test.value = isEdit ? testData : {};
      openAdd.value = isEdit;
    };

    const deleteTest = async (id: string) => {
      const token = localStorage.getItem("token") || "";
      const options = {
        url: `${BaseUrl}/tests/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BaseUrl}/tests/${id}`, {
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
        })
        .then((data) => getTests());
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
      test,
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
      deleteTest,
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
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
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
  justify-content: space-between;
}
</style>
