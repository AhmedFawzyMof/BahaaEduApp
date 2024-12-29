<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" color="light">
      <ion-card style="min-height: 480px" dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة الطلاب</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item
              v-if="students.length > 0"
              v-for="student in students"
              :key="student.id"
            >
              <div class="student">
                <div class="char">
                  {{ student.username[0] }}
                </div>
                <div class="ditails">
                  <h1>{{ student.username }}</h1>

                  <router-link
                    :to="`/questions/answers/${student.id}/${stage}/${term}`"
                  >
                    <p>عرض الاجابات</p>
                  </router-link>
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
import { defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "@/utils/BaseUrl";
import Header from "@/components/Header.vue";
import Questions from "@/components/Questions.vue";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
} from "@ionic/vue";
export default defineComponent({
  name: "QuestionsView",
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonSelect,
    IonSelectOption,
    Header,
    Questions,
    IonList,
    IonItem,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const token = localStorage.getItem("token");
    const stage = router.currentRoute.value.params.stage;
    const term = router.currentRoute.value.params.term;
    const students = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getQuestionBankData();
    });

    const getQuestionBankData = () => {
      fetch(`${BaseUrl}/questions/students/${stage}/${term}`, {
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
          students.value = data.data;
        });
    };

    return {
      students,
      stage,
      term,
    };
  },
});
</script>
<style>
.char {
  background: var(--ion-color-primary);
  color: white;
  border-radius: 5px;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  box-shadow: #5190e2 0px 2.5px 10px;
  margin-right: 5px;
}

.student {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 5px;
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
