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
          <DataTable
            Type="student"
            :Data="students"
            :Grades="academicStages"
            :Edit="edit"
            :RefReshFunc="getStudents"
            @edit="editStudent"
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
import StudentsForm from "@/components/forms/StudentsForm.vue";
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
  name: "Students",
  components: {
    Header,
    DataTable,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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

            if (students.value.length === 0) {
              students.value = data.students;
            }

            if (students.value.length === 30 || students.value.length > 30) {
              students.value.push(...data.students);
            }

            if (data.students.length === 0) {
              return;
            }
          }
        });
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      student.value = {};
      edit.value = false;
    };

    const editStudent = (data: any) => {
      edit.value = data.edit;
      student.value = data.edit ? data.instace : {};
      openAdd.value = data.edit;
    };

    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (students.value.length < 30) {
        ev.target.disabled = true;
        return;
      }
      limit.value += 30;
      getStudents();
      setTimeout(() => ev.target.complete(), 500);
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
      ionInfinite,
    };
  },
});
</script>
