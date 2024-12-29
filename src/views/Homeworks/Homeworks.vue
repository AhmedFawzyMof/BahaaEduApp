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
          <DataTable
            :Data="homeworks"
            :Grades="academicStages"
            :Terms="terms"
            Type="homework"
            :Edit="edit"
            :RefReshFunc="getHomeworks"
            @edit="editHomework"
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
import HomeworkForm from "@/components/forms/HomeworkForm.vue";
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
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";

import { addCircleOutline } from "ionicons/icons";
import DataTable from "@/components/DataTable.vue";

export default defineComponent({
  name: "Homeworks",
  components: {
    Header,
    DataTable,
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
    IonButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const addCircleOutlineIcon = addCircleOutline;
    const academicStages = ref<Array<any>>([]);
    const homeworks = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const homework = ref<any>({});
    const terms = ref([
      { id: 1, term_name: "الاول" },
      { id: 2, term_name: "الثاني" },
      { id: 3, term_name: "لا يوجد" },
    ]);

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getHomeworks();
    });

    const getHomeworks = async () => {
      const token = localStorage.getItem("token") || "";

      fetch(`${BaseUrl}/homeworks/getall/${stage.value}/${limit.value}`, {
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

            if (homeworks.value.length === 0) {
              homeworks.value = data.homeworks;
            }

            if (homeworks.value.length === 30 || homeworks.value.length > 30) {
              homeworks.value.push(...data.homeworks);
            }

            if (data.homeworks.length === 0) {
              return;
            }
          }
        });
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      homework.value = {};
      edit.value = false;
    };

    const editHomework = (data: any) => {
      edit.value = data.edit;
      homework.value = data.edit ? data.instace : {};
      openAdd.value = data.edit;
    };

    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (homeworks.value.length < 30) {
        ev.target.disabled = true;
        return;
      }
      limit.value += 30;
      getHomeworks();
      setTimeout(() => ev.target.complete(), 500);
    };

    const showHomework = (id: number) => {
      router.push(`/homework/${id}`);
    };

    watch(stage, getHomeworks);
    watch(limit, getHomeworks);

    return {
      academicStages,
      homeworks,
      stage,
      limit,
      openAdd,
      edit,
      homework,
      terms,
      addCircleOutlineIcon,
      getHomeworks,
      openAddModal,
      editHomework,
      showHomework,
      ionInfinite,
    };
  },
});
</script>
