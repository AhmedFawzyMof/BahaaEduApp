<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" color="light">
      <ion-button color="primary" expand="block" @click="OpenAdd(!openAdd)">
        <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
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
                        <ion-button @click="Edit(grade, !edit)">
                          <ion-icon
                            slot="icon-only"
                            :icon="createOutline"
                          ></ion-icon>
                        </ion-button>
                        <ion-button @click="Delete(grade.id)" color="danger">
                          <ion-icon
                            slot="icon-only"
                            :icon="trashOutline"
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
<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import GradesForm from "@/components/forms/GradeForm.vue";
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
export default {
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
  data() {
    return {
      academicStages: [],
      grades: [],
      openAdd: false,
      edit: false,
      grade: {},
      createOutline,
      trashOutline,
      addCircleOutline,
      eyeOutline,
    };
  },
  mounted() {
    this.$store.commit("isLoggedIn", this.$router);
    this.getGrades();
  },
  methods: {
    getGrades() {
      axios
        .get(`/grades/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.grades = response.data;
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
      this.grade = {};
    },
    Edit(grade, edit) {
      this.edit = edit;
      if (edit) {
        this.grade = grade;
      }
      this.openAdd = edit;
    },
    Delete(id) {
      axios
        .delete(`/grades/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.getGrades();
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
    limit(newVal, oldVal) {
      this.limit = newVal;
      this.getGrades();
    },
  },
};
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
