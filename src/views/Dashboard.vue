<template>
  <ion-page>
    <ion-content :fullscreen="true" color="light">
      <Header />
      <ion-grid dir="rtl">
        <ion-row>
          <ion-col>
            <div class="stat blue">
              <h1 class="stat-title">عدد الطلاب</h1>
              <p class="stat-value">{{ num_users }}</p>
            </div>
          </ion-col>
          <ion-col>
            <div class="stat blue">
              <h1 class="stat-title">عدد المتفوقين</h1>
              <p class="stat-value">{{ above_average }}</p>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <div class="stat blue">
              <h1 class="stat-title">متوسط ​​الدرجات للاختبار الأخير</h1>
              <p class="stat-value">{{ average_result }}%</p>
            </div>
          </ion-col>
          <ion-col>
            <div class="stat blue">
              <h1 class="stat-title">​​معدل النجاح في الاختبار الأخير</h1>
              <p class="stat-value">{{ pass_rate }}%</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-card style="min-height: 480px" dir="rtl">
        <ion-card-header>
          <ion-card-title>الطلاب المتفوقين</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item v-for="student in outStanding" :key="student.id">
              <div class="student">
                <div class="char">
                  {{ student.username[0] }}
                </div>
                <div class="ditails">
                  <router-link :to="`/student/${student.id}`">
                    <h1>{{ student.username }}</h1>
                  </router-link>
                  <div class="grade">
                    <p>{{ student.grade_name }}</p>
                    <p class="result">{{ student.Aresult }}%</p>
                  </div>
                </div>
              </div>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import {
  IonPage,
  IonTitle,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
} from "@ionic/vue";
export default {
  name: "Dashboard",
  components: {
    Header,
    IonPage,
    IonTitle,
    IonContent,
    IonCol,
    IonGrid,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
  },
  data() {
    return {
      above_average: 0,
      num_users: 0,
      average_result: 0,
      pass_rate: 0,
      outStanding: [],
    };
  },
  mounted() {
    this.$store.commit("isLoggedIn", this.$router);
    const token = localStorage.getItem("token") || "";
    this.getDashboard(token);
  },
  methods: {
    getDashboard(token) {
      axios
        .get("/teacher/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.dashboard;
          this.num_users = data.num_users;
          this.above_average = data.above_average;
          this.average_result = data.average_result;
          this.outStanding = data.outstandingStudents;
          this.pass_rate =
            (data.PassRate.number_of_pass / data.PassRate.total_students) * 100;
        })
        .catch((error) => {
          if (error.status == 401) {
            this.$store.commit("logout");
            this.$router.push({ name: "Login" });
          }
        });
    },
  },
};
</script>
<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 10px;
  aspect-ratio: 1.5 / 1;
  border-radius: 10px;
}

.stat.blue {
  background: linear-gradient(-750deg, #5190e2, #8cc6ff);
  box-shadow: #5190e2 0px 3px 5px;
}

.stat-title {
  height: 10px;
  font-size: 18px;
  font-weight: 600;
  color: white;
}
.stat-value {
  height: 10px;
  font-size: 20px;
  font-weight: bold;
  color: white;
}
.char {
  background: var(--ion-color-primary);
  color: white;
  border-radius: 5px;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  box-shadow: #5190e2 0px 2.5px 10px;
  margin-right: 5px;
}

.student {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
}

.student .ditails {
  display: flex;
  flex-direction: column;
}

.ditails h1 {
  font-size: 18px;
  color: #000;
  text-decoration: underline;
}

.grade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ion-color-primary);
  font-size: 12px;
}
</style>
