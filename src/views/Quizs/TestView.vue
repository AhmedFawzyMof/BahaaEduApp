<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" color="light">
      <ion-card dir="rtl" v-if="type !== ''">
        <ion-card-header>متوسط ​​الدرجات</ion-card-header>
        <ion-card-content>
          <h1>{{ average }}</h1>
        </ion-card-content>
      </ion-card>
      <ion-card dir="rtl" v-if="type !== ''">
        <ion-card-header>​​معدل النجاح</ion-card-header>
        <ion-card-content>
          <h1>{{ pass_rate }}%</h1>
        </ion-card-content>
      </ion-card>
      <ion-card dir="rtl">
        <ion-card-content>
          <ion-select
            placeholder="اختر ما تريد إظهاره"
            dir="rtl"
            v-model="type"
          >
            <ion-select-option value="questions">
              عرض أسئلة الواجب المنزلي
            </ion-select-option>
            <ion-select-option value="students">
              إظهار قائمة الطلاب الذين قاموا بالواجب المنزلي
            </ion-select-option>
          </ion-select>
        </ion-card-content>
      </ion-card>
      <Questions
        v-if="type === 'questions'"
        v-for="question in TestData"
        :key="question.id"
        :question="question"
        :show="true"
        @delete="HandleDelete"
      />

      <ion-card v-if="type === 'students'" style="min-height: 480px" dir="rtl">
        <ion-card-header>
          <ion-card-title>قائمة الطلاب</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item
              v-if="type === 'students'"
              v-for="student in TestData"
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
                  <router-link :to="`/test/answers/${student.id}/${id}`">
                    <p>عرض الاجابات</p>
                  </router-link>
                  <div class="grade">
                    <p>{{ student.grade_name }}</p>
                    <p class="result">{{ student.result }}</p>
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
  name: "TestView",
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
    const id = router.currentRoute.value.params.id;
    const type = ref<string>("");
    const average = ref<number>(0);
    const pass_rate = ref<number>(0);
    const TestData = ref<Array<any>>([]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
    });
    const getTestData = () => {
      fetch(`${BaseUrl}/tests/techer/${type.value}/${id}`, {
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
          average.value = data.avgGrade.average_result;
          pass_rate.value =
            (data.passRate.number_of_pass / data.passRate.total_students) * 100;
          TestData.value = data.data;
        });
    };

    const HandleDelete = () => {
      getTestData();
    };

    watch(type, () => {
      getTestData();
    });

    return {
      type,
      average,
      pass_rate,
      TestData,
      id,
      HandleDelete,
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
