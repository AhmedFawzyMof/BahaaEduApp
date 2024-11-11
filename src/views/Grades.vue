<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" color="light">
      <ion-button
        color="primary"
        expand="block"
        @click="openAddModal(!openAdd)"
      >
        <ion-icon slot="icon-only" :icon="addCircleOutlineIcon"></ion-icon>
        <p style="margin-left: 10px">اضافة مرحلة</p>
      </ion-button>
      <GradesForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Grade="grade"
        @formSubmitted="getGrades"
      />
      <ion-card dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة مرحلة الدراسية</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid v-if="grades.length > 0">
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 100%"
                  >
                    <ion-col class="header-cell" style="white-space: nowrap"
                      >الاسم</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap"
                    ></ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(grade, index) in grades"
                    :key="grade.id"
                    :style="`${
                      index === grades.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 100%"
                  >
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        display: grid;
                        place-items: center;
                      "
                    >
                      {{ grade.grade_name }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        display: grid;
                        place-items: center;
                      "
                    >
                      <div class="buttons">
                        <ion-button @click="editGrade(grade, !edit)">
                          <ion-icon
                            slot="icon-only"
                            :icon="createOutlineIcon"
                          ></ion-icon>
                        </ion-button>
                        <ion-button
                          @click="deleteGrade(grade.id)"
                          color="danger"
                        >
                          <ion-icon
                            slot="icon-only"
                            :icon="trashOutlineIcon"
                          ></ion-icon>
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
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import GradesForm from "@/components/forms/GradeForm.vue";
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
  name: "Grades",
  components: {
    Header,
    GradesForm,
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
    const academicStages = ref<Array<any>>([]); // Adjust type if needed
    const grades = ref<Array<any>>([]);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const grade = ref<any>({});
    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const addCircleOutlineIcon = addCircleOutline;
    const eyeOutlineIcon = eyeOutline;

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getGrades();
    });

    const getGrades = () => {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/grades/all`, {
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
            grades.value = data;
          }
        });
    };

    const openAddModal = (open: boolean) => {
      openAdd.value = open;
      grade.value = {};
      edit.value = false;
    };

    const editGrade = (gradeData: any, isEdit: boolean) => {
      edit.value = isEdit;
      grade.value = isEdit ? gradeData : {};
      openAdd.value = isEdit;
    };

    const deleteGrade = (id: string) => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/grades/${id}`, {
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
        .then((data) => getGrades());
    };

    return {
      academicStages,
      grades,
      openAdd,
      edit,
      grade,
      createOutlineIcon,
      trashOutlineIcon,
      addCircleOutlineIcon,
      eyeOutlineIcon,
      getGrades,
      openAddModal,
      editGrade,
      deleteGrade,
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
}
</style>
