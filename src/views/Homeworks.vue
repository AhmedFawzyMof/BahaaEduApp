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
        <p style="margin-left: 10px">اضافة واجب</p>
      </ion-button>
      <HomeworkForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Homework="homework"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="getHomeworks"
      />
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الواجبات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid v-if="homeworks.length > 0">
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 600px"
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
                    >
                    </ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(homework, index) in homeworks"
                    :key="index"
                    :style="`${
                      index === homeworks.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 600px"
                  >
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                    >
                      {{ homework.homework_name }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 120px">
                      {{ homework.created_at }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                    >
                      {{ grade(homework.grade_id) }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                    >
                      {{ term(homework.term_id) }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 120px"
                    >
                      <div class="buttons">
                        <ion-button @click="editHomework(homework, !edit)">
                          <ion-icon :icon="createOutlineIcon" />
                        </ion-button>
                        <ion-button
                          color="danger"
                          @click="deleteHomework(homework.id)"
                        >
                          <ion-icon :icon="trashOutlineIcon" />
                        </ion-button>
                        <ion-button color="secondary">
                          <ion-icon :icon="eyeOutlineIcon" />
                        </ion-button>
                      </div>
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
import HomeworkForm from "@/components/forms/HomeworkForm.vue";
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
import { get } from "axios";

export default defineComponent({
  name: "Homeworks",
  components: {
    Header,
    HomeworkForm,
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
    const homeworks = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const homework = ref<any>({});
    const terms = ref([
      { id: 1, term_name: "الاول" },
      { id: 2, term_name: "الثاني" },
      { id: 3, term_name: "لا يوجد" },
    ]);

    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const addCircleOutlineIcon = addCircleOutline;
    const eyeOutlineIcon = eyeOutline;

    const grade = (id: number) => {
      const stageData = academicStages.value.find((stage) => stage.id === id);
      return stageData ? stageData.grade_name : "";
    };

    const term = (id: number) => {
      const termData = terms.value.find((term) => term.id === id);
      return termData ? termData.term_name : "";
    };

    const getHomeworks = async () => {
      const token = localStorage.getItem("token") || "";
      const options = {
        url: `${BaseUrl}/homeworks/getall/${stage.value}/${limit.value}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BaseUrl}/homeworks/getall/${stage.value}/${limit.value}`, {
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
            homeworks.value = data.homeworks;
          }
        });
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      homework.value = {};
    };

    const editHomework = (homeworkData: any, isEdit: boolean) => {
      edit.value = isEdit;
      homework.value = isEdit ? homeworkData : {};
      openAdd.value = isEdit;
    };

    const deleteHomework = async (id: string) => {
      const token = localStorage.getItem("token") || "";
      const options = {
        url: `${BaseUrl}/homeworks/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      fetch(`${BaseUrl}/homeworks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            store.commit("logout");
            router.push("/login");
            return;
          }
        })
        .then((data) => getHomeworks());
    };

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getHomeworks();
    });

    watch(stage, getHomeworks);
    watch(limit, getHomeworks);

    return {
      academicStages,
      homeworks,
      stage,
      limit,
      openAdd,
      edit,
      homework,
      terms,
      createOutlineIcon,
      trashOutlineIcon,
      addCircleOutlineIcon,
      eyeOutlineIcon,
      grade,
      term,
      getHomeworks,
      openAddModal,
      editHomework,
      deleteHomework,
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
