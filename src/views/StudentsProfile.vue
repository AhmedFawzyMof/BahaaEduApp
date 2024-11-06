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
      <ion-button color="primary" expand="block" @click="OpenAdd(!openAdd)">
        <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
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
              <ion-grid v-if="students.length > 0">
                <ion-row>
                  <ion-col style="text-wrap: nowrap">الاسم</ion-col>
                  <ion-col style="text-wrap: nowrap">تم حظره</ion-col>
                  <ion-col style="text-wrap: nowrap">هاتف ولي الامر</ion-col>
                  <ion-col style="text-wrap: nowrap">سبب الحظر</ion-col>
                  <ion-col></ion-col>
                </ion-row>
                <ion-row
                  v-for="(student, index) in students"
                  :key="student.id"
                  :style="`${
                    index === students.length - 1
                      ? 'border-bottom: none'
                      : 'border-bottom: 1px solid #ccc'
                  }`"
                >
                  <ion-col
                    style="
                      text-wrap: nowrap;
                      display: grid;
                      place-items: center;
                    "
                    >{{ student.username }}</ion-col
                  >
                  <ion-col
                    style="
                      text-wrap: nowrap;
                      display: grid;
                      place-items: center;
                    "
                    >{{ student.isBlocked === 1 ? "نعم" : "لا" }}</ion-col
                  >
                  <ion-col
                    style="
                      text-wrap: nowrap;
                      display: grid;
                      place-items: center;
                    "
                  >
                    <a :href="`https://wa.me/+2${student.parent_phone}?`">
                      {{ student.parent_phone }}
                    </a>
                  </ion-col>
                  <ion-col style="display: grid; place-items: center">{{
                    student.isBlocked === 1 ? student.BlockReason : ""
                  }}</ion-col>
                  <ion-col>
                    <ion-button @click="Edit(student, !edit)">
                      <ion-icon
                        slot="icon-only"
                        :icon="createOutline"
                      ></ion-icon>
                    </ion-button>
                    <ion-button @click="Delete(student.id)" color="danger">
                      <ion-icon
                        slot="icon-only"
                        :icon="trashOutline"
                      ></ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <div class="noData" v-else>
                <p>لا توجد بيانات حتى الان</p>
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
<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import StudentsForm from "@/components/forms/StudentsForm.vue";
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
import { createOutline, trashOutline, addCircleOutline } from "ionicons/icons";
export default {
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
  data() {
    return {
      academicStages: [],
      students: [],
      stage: 0,
      limit: 30,
      openAdd: false,
      edit: false,
      student: {},
      createOutline,
      trashOutline,
      addCircleOutline,
    };
  },
  mounted() {
    this.$store.commit("isLoggedIn", this.$router);
    this.getStudents();
  },
  methods: {
    getStudents() {
      axios
        .get(`/student/all/${this.stage}/${this.limit}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.academicStages = response.data.grades;
          this.students = response.data.students;
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$store.commit("logout");
            this.$router.push({ name: "Login" });
          }
        });
    },
    OpenAdd(openAdd) {
      this.openAdd = openAdd;
      this.student = {};
    },
    Edit(student, edit) {
      this.edit = edit;
      if (edit) {
        this.student = student;
      }
      this.openAdd = edit;
    },
    Delete(id) {
      axios
        .delete(`/student/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.getStudents();
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$store.commit("logout");
            this.$router.push({ name: "Login" });
          }
        });
    },
  },
  watch: {
    stage(newVal, oldVal) {
      this.stage = newVal;
      this.getStudents();
    },
    limit(newVal, oldVal) {
      this.limit = newVal;
      this.getStudents();
    },
  },
};
</script>
<style>
.noData {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-family: Cairo;
  font-size: 20px;
}
.grid-container {
  overflow-x: auto;
  width: 100%;
}

.grid {
  display: inline-block;
  min-width: 600px; /* Adjust this value as needed */
}
</style>
