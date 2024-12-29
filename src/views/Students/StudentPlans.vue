<template>
  <ion-page>
    <Header />
    <ion-content>
      <ion-card dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة الخطط الدراسية</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="tableContainer">
            <div class="tableWrapper" v-if="plans.length > 0">
              <table>
                <thead>
                  <tr>
                    <th>اسم المادة الدراسية</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(p, index) in plans"
                    :key="index"
                    :class="`${index === plans.length - 1 ? 'lastRow' : ''}`"
                  >
                    <td>{{ p.subject }}</td>
                    <td>
                      <div class="buttons">
                        <ion-button color="danger" @click="DeleteData(p.id)">
                          <ion-icon :icon="trashOutlineIcon" />
                        </ion-button>
                        <ion-button color="secondary" @click="ShowData(p.id)">
                          <ion-icon :icon="eyeOutlineIcon" />
                        </ion-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="noData" v-else>
              <p>لا توجد بيانات حتى الان</p>
            </div>
          </div>
          <AddPlan :student_id="String(student_id)" />
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Header from "@/components/Header.vue";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { trashOutline, eyeOutline } from "ionicons/icons";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AddPlan from "@/components/AddPlan.vue";
import { BaseUrl } from "../../utils/BaseUrl";

export default defineComponent({
  name: "StudentPlans",
  components: {
    Header,
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    AddPlan,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const student_id = router.currentRoute.value.params.student_id;
    const plans = ref<any>([]);
    const trashOutlineIcon = trashOutline;
    const eyeOutlineIcon = eyeOutline;

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getStudentPlans();
    });

    const getStudentPlans = () => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/student/teacher/plans/${student_id}`, {
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
          plans.value = data.plans;
        });
    };

    const DeleteData = (id: any) => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/student/teacher/plan/${id}`, {
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
        .then((data) => getStudentPlans());
    };

    const ShowData = (id: any) => {
      router.push(`/student/plan/${id}`);
    };

    return {
      student_id,
      plans,
      trashOutlineIcon,
      eyeOutlineIcon,
      DeleteData,
      ShowData,
    };
  },
});
</script>

<style>
.tableContainer {
  width: 100%;
  margin-bottom: 10px;
}
.tableWrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px;
}
table {
  min-width: 350px;
  max-width: 950px;
}

table thead {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}

table thead tr th {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #ddd;
  font-weight: bold;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

table thead tr th:last-child {
  border-left: 1px solid #ddd;
}

table tbody tr td {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #ddd;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.lastRow {
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.lastRow td:last-child {
  border-left: 1px solid #ddd;
}
</style>
