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
        <p style="margin-left: 10px">اضافة طالب</p>
      </ion-button>
      <StudentsForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Student="student"
        :Grades="academicStages"
        @formSubmitted="getStudents"
      />
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الطلاب</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid v-if="students.length > 0">
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 800px"
                  >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 150px"
                      >الاسم</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 100px"
                      >تم حظره</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 150px"
                      >هاتف ولي الامر</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 150px"
                      >سبب الحظر</ion-col
                    >
                    <ion-col
                      class="header-cell"
                      style="white-space: nowrap; min-width: 100px"
                    ></ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(student, index) in students"
                    :key="student.id"
                    :style="`${
                      index === students.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 800px"
                  >
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        min-width: 150px;
                        display: grid;
                        place-items: center;
                      "
                    >
                      {{ student.username }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        min-width: 100px;
                        display: grid;
                        place-items: center;
                      "
                    >
                      {{ student.isBlocked === 1 ? "نعم" : "لا" }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        min-width: 150px;
                        display: grid;
                        place-items: center;
                      "
                    >
                      <a :href="`https://wa.me/+2${student.parent_phone}?`">{{
                        student.parent_phone
                      }}</a>
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="
                        white-space: nowrap;
                        min-width: 150px;
                        display: grid;
                        place-items: center;
                      "
                    >
                      {{ student.isBlocked === 1 ? student.BlockReason : "" }}
                    </ion-col>
                    <ion-col
                      class="data-cell"
                      style="white-space: nowrap; min-width: 100px"
                    >
                      <div class="buttons">
                        <ion-button @click="editStudent(student, !edit)">
                          <ion-icon
                            slot="icon-only"
                            :icon="createOutlineIcon"
                          ></ion-icon>
                        </ion-button>
                        <ion-button
                          @click="deleteStudent(student.id)"
                          color="danger"
                        >
                          <ion-icon
                            slot="icon-only"
                            :icon="trashOutlineIcon"
                          ></ion-icon>
                        </ion-button>
                        <ion-button color="primary">
                          <ion-icon
                            slot="icon-only"
                            :icon="eyeOutlineIcon"
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
import StudentsForm from "@/components/forms/StudentsForm.vue";
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
  name: "Students",
  components: {
    Header,
    StudentsForm,
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
    const students = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const student = ref<any>({});

    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const addCircleOutlineIcon = addCircleOutline;
    const eyeOutlineIcon = eyeOutline;

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getStudents();
    });

    const getStudents = async () => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/student/all/${stage.value}/${limit.value}`, {
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
            students.value = data.students;
          }
        });
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      student.value = {};
    };

    const editStudent = (studentData: any, isEdit: boolean) => {
      edit.value = isEdit;
      student.value = isEdit ? studentData : {};
      openAdd.value = isEdit;
    };

    const deleteStudent = async (id: string) => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/student/${id}`, {
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
        .then((data) => getStudents());
    };

    watch(stage, getStudents);
    watch(limit, getStudents);

    return {
      academicStages,
      students,
      stage,
      limit,
      openAdd,
      edit,
      student,
      createOutlineIcon,
      trashOutlineIcon,
      addCircleOutlineIcon,
      eyeOutlineIcon,
      getStudents,
      openAddModal,
      editStudent,
      deleteStudent,
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
