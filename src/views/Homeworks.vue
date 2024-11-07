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
                        <ion-button @click="EditHomework(homework, !edit)">
                          <ion-icon :icon="createOutline" />
                        </ion-button>
                        <ion-button
                          color="danger"
                          @click="DeleteHomework(homework.id)"
                        >
                          <ion-icon :icon="trashOutline" />
                        </ion-button>
                        <ion-button
                          color="secondary"
                          @click="ViewHomework(homework.id)"
                        >
                          <ion-icon :icon="eyeOutline" />
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
<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import HomeworkForm from "@/components/forms/HomeworkForm.vue";
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
  data() {
    return {
      academicStages: [],
      homeworks: [],
      stage: 0,
      limit: 30,
      openAdd: false,
      edit: false,
      homework: {},
      createOutline,
      trashOutline,
      addCircleOutline,
      eyeOutline,
      terms: [
        { id: 1, term_name: "الاول" },
        { id: 2, term_name: "الثاني" },
        { id: 3, term_name: "لا يوجد" },
      ],
    };
  },
  mounted() {
    this.$store.commit("isLoggedIn", this.$router);
    this.getHomeworks();
  },
  methods: {
    grade(id) {
      const stage = this.academicStages.find((stage) => stage.id == id);
      return stage.grade_name;
    },
    term(id) {
      const term = this.terms.find((term) => term.id == id);
      return term.term_name;
    },
    getHomeworks() {
      axios
        .get(`/homeworks/getall/${this.stage}/${this.limit}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.academicStages = response.data.grades;
          this.homeworks = response.data.homeworks;
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
      this.homework = {};
    },
    EditHomework(homework, edit) {
      this.edit = edit;
      if (edit) {
        this.homework = homework;
      }
      this.openAdd = edit;
    },
    DeleteHomework(id) {
      axios
        .delete(`/homeworks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.getHomeworks();
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
      this.getHomeworks();
    },
    limit(newVal, oldVal) {
      this.limit = newVal;
      this.getHomeworks();
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
  justify-content: space-between;
}
</style>
