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
            <ion-item
              v-if="outStanding.length > 0"
              v-for="student in outStanding"
              :key="student.id"
            >
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
            <ion-item v-else>
              <p>لا يوجد بيانات متاحة</p>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../utils/BaseUrl";

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

export default defineComponent({
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
  setup() {
    const store = useStore();
    const router = useRouter();
    const above_average = ref<number>(0);
    const num_users = ref<number>(0);
    const average_result = ref<number>(0);
    const pass_rate = ref<number>(0);
    const outStanding = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("initializeStore");
      const token = localStorage.getItem("token") || "";
      getDashboard(token);
    });

    function getDashboard(token: string): void {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(`${BaseUrl}/teacher/dashboard`, options)
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
            const dashboard = data.dashboard;
            num_users.value = dashboard.num_users;
            above_average.value = dashboard.above_average;
            average_result.value = dashboard.average_result;
            outStanding.value = dashboard.outstandingStudents;
            pass_rate.value =
              (dashboard.PassRate.number_of_pass /
                dashboard.PassRate.total_students) *
              100;

            if (typeof pass_rate.value !== "number") {
              pass_rate.value = 0;
            }

            if (average_result.value === null) {
              average_result.value = 0;
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });
    }

    return {
      store,
      router,
      above_average,
      num_users,
      average_result,
      pass_rate,
      outStanding,
    };
  },
});
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
  font-size: 15px;
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
