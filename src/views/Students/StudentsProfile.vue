<template>
  <ion-page>
    <Header />
    <ion-content>
      <Chart :chartData="chart_data" />
      <AddPlan :student_id="String(student_id)" />
      <router-link style="width: 100%" :to="`/student/${student_id}/plans`">
        <ion-button color="secondary" style="margin: 10px" expand="block">
          قائمة الخطط الدراسية
        </ion-button>
      </router-link>
      <ion-card dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة الواجبات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid>
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 500px"
                  >
                    <ion-col class="header-cell" style="min-width: 120px">
                      اسم الواجب المنزلي
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 120px">
                      النتيجة
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 60px">
                      تم النشر
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 200px">
                    </ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(homework, index) in StudentHomeworks"
                    :key="index"
                    :style="`${
                      index === StudentHomeworks.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 500px"
                  >
                    <ion-col class="data-cell" style="min-width: 120px">
                      {{ homework.homework_name }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 120px">
                      {{ homework.result }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 60px">
                      {{ homework.public ? "نعم" : "لا" }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 200px">
                      <div class="buttons">
                        <ion-button
                          color="secondary"
                          @click="showHomework(homework.id)"
                        >
                          <ion-icon :icon="eyeOutline" />
                        </ion-button>
                        <ion-button
                          @click="
                            Publish('homework', homework.id, homework.public)
                          "
                        >
                          {{ homework.public ? "إلغاء النشر" : "نشر النتيجة" }}
                        </ion-button>
                      </div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
      <ion-card dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة الاختبارات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="grid-container">
            <div class="grid">
              <div class="table-wrapper">
                <ion-grid>
                  <ion-row
                    class="table-header"
                    style="border-bottom: 1px solid #ccc; min-width: 500px"
                  >
                    <ion-col class="header-cell" style="min-width: 120px">
                      اسم الواجب المنزلي
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 120px">
                      النتيجة
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 60px">
                      تم النشر
                    </ion-col>
                    <ion-col class="header-cell" style="min-width: 200px">
                    </ion-col>
                  </ion-row>

                  <ion-row
                    v-for="(test, index) in StudentTests"
                    :key="index"
                    :style="`${
                      index === StudentTests.length - 1
                        ? 'border-bottom: none'
                        : 'border-bottom: 1px solid #ccc'
                    }`"
                    class="ion-align-items-start"
                    style="min-width: 500px"
                  >
                    <ion-col class="data-cell" style="min-width: 120px">
                      {{ test.test_name }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 120px">
                      {{ test.result }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 60px">
                      {{ test.public ? "نعم" : "لا" }}
                    </ion-col>
                    <ion-col class="data-cell" style="min-width: 200px">
                      <div class="buttons">
                        <ion-button
                          color="secondary"
                          @click="showTest(test.id)"
                        >
                          <ion-icon :icon="eyeOutline" />
                        </ion-button>
                        <ion-button
                          @click="Publish('test', test.id, test.public)"
                        >
                          {{ test.public ? "إلغاء النشر" : "نشر النتيجة" }}
                        </ion-button>
                      </div>
                    </ion-col>
                  </ion-row>
                </ion-grid>
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
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import Header from "@/components/Header.vue";
import AddPlan from "@/components/AddPlan.vue";
import Chart from "@/components/Chart.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";
import { HomeworkChartData, TestsChartData } from "@/utils/Types";
import GetMonth from "@/utils/GetMonth";
import { eyeOutline } from "ionicons/icons";
import PublishResult from "@/utils/PublishResult";
import { ChartData } from "chart.js";
export default defineComponent({
  name: "StudentsProfile",
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    Header,
    Chart,
    AddPlan,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const student_id = router.currentRoute.value.params.id;
    const chart_data = ref<ChartData<"bar">>({
      labels: [] as string[],
      datasets: [],
    });
    const StudentHomeworks = ref<
      { id: number; homework_name: string; result: string; public: boolean }[]
    >([]);
    const StudentTests = ref<
      { id: number; test_name: string; result: string; public: boolean }[]
    >([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getStudentData();
    });

    const getStudentData = () => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/student/${student_id}`, {
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
          const homework_data: HomeworkChartData[] = data.homeworkChartData;
          const test_data: TestsChartData[] = data.testsChartData;
          const homeworks_dates = homework_data.map(
            (item: HomeworkChartData) => item.month
          );
          const test_dates = test_data.map(
            (item: TestsChartData) => item.month
          );
          const dates = [...homeworks_dates, ...test_dates];
          const homeworks = homework_data.map((item: HomeworkChartData) => {
            return parseFloat(item.result);
          });
          const tests = test_data.map((item: TestsChartData) => {
            return parseFloat(item.result);
          });

          chart_data.value = {
            labels: GetMonth(dates),
            datasets: [
              {
                label: "واجبات المنزلية",
                data: homeworks,
                backgroundColor: "#0054e9",
                borderColor: "#0054e9",
                borderWidth: 1,
              },
              {
                label: "اختبارات",
                data: tests,
                backgroundColor: "#6030ff",
                borderColor: "#6030ff",
                borderWidth: 1,
              },
            ],
          };
          StudentHomeworks.value = data.UserSolvedHomework;
          StudentTests.value = data.UserSolvedTests;
        });
    };

    const Publish = (type: string, id: number, publish: boolean) => {
      PublishResult(
        type,
        id,
        String(student_id),
        publish,
        store,
        router,
        getStudentData
      );
    };

    const showHomework = (id: number) => {
      router.push(`/homework/answers/${student_id}/${id}`);
    };

    const showTest = (id: number) => {
      router.push(`/test/answers/${student_id}/${id}`);
    };

    return {
      chart_data,
      StudentHomeworks,
      StudentTests,
      eyeOutline,
      student_id,
      showHomework,
      showTest,
      Publish,
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
  -webkit-overflow-scrolling: touch;
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
