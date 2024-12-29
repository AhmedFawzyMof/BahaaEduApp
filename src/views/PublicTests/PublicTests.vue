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
        <p style="margin-left: 10px">اضافة اختبار</p>
      </ion-button>
      <PublicTestForm
        :isOpen="openAdd"
        :isEdit="edit"
        :PublicTest="publictest"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="getPublicTests"
      />
      <ion-card v-if="qrCodeImage">
        <img :src="qrCodeImage" alt="QR Code" style="width: 100%" />
        <a
          :href="qrCodeImage"
          download="qrcode.png"
          style="position: absolutes; top: 0"
        >
          تحميل كود qr
        </a>
      </ion-card>
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الاختبارات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <DataTable
            Type="public_test"
            :Data="publictests"
            :Grades="academicStages"
            :Terms="terms"
            :Edit="edit"
            :RefReshFunc="getPublicTests"
            @edit="editPublicTest"
            @qrcode="generateQRCode"
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";
import PublicTestForm from "@/components/forms/PublicForm.vue";
import QRCodeGenerator from "qrcode-generator";

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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";

import { addCircleOutline } from "ionicons/icons";
import DataTable from "@/components/DataTable.vue";

export default defineComponent({
  name: "PublicTests",
  components: {
    Header,
    DataTable,
    PublicTestForm,
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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const qrCodeImage = ref<string | null>(null);
    const academicStages = ref<Array<any>>([]);
    const publictests = ref<Array<any>>([]);
    const stage = ref<number>(0);
    const limit = ref<number>(30);
    const openAdd = ref<boolean>(false);
    const edit = ref<boolean>(false);
    const publictest = ref<any>({});
    const addCircleOutlineIcon = addCircleOutline;

    const terms = ref([
      { id: 1, term_name: "الاول" },
      { id: 2, term_name: "الثاني" },
      { id: 3, term_name: "لا يوجد" },
    ]);

    const generateQRCode = (url: string): void => {
      try {
        const qr = QRCodeGenerator(0, "L");
        qr.addData(url);
        qr.make();
        const cellSize = 10;
        const margin = 2;
        qrCodeImage.value = qr.createDataURL(cellSize, margin);
      } catch (error) {
        console.error("Error generating QR Code:", error);
      }
    };

    const getPublicTests = async () => {
      const token = localStorage.getItem("token") || "";
      fetch(`${BaseUrl}/public_tests/getall/${stage.value}/${limit.value}`, {
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

            if (publictests.value.length === 0) {
              publictests.value = data.tests;
            }

            if (
              publictests.value.length === 30 ||
              publictests.value.length > 30
            ) {
              publictests.value.push(...data.tests);
            }

            if (data.tests.length === 0) {
              return;
            }
          }
        });
    };

    const grade = (id: number) => {
      const stage = academicStages.value.find((stage) => stage.id === id);
      return stage ? stage.grade_name : "";
    };

    const term = (id: number) => {
      const term = terms.value.find((term) => term.id === id);
      return term ? term.term_name : "";
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      publictest.value = {};
      edit.value = false;
    };

    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (publictests.value.length < 30) {
        ev.target.disabled = true;
        return;
      }
      limit.value += 30;
      getPublicTests();
      setTimeout(() => ev.target.complete(), 500);
    };

    const editPublicTest = (data: any) => {
      edit.value = data.edit;
      publictest.value = data.edit ? data.instace : {};
      openAdd.value = data.edit;
    };

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getPublicTests();
    });

    watch(stage, getPublicTests);
    watch(limit, getPublicTests);

    return {
      academicStages,
      publictests,
      stage,
      limit,
      openAdd,
      edit,
      publictest,
      addCircleOutlineIcon,
      terms,
      qrCodeImage,
      BaseUrl,
      generateQRCode,
      getPublicTests,
      grade,
      term,
      openAddModal,
      editPublicTest,
      ionInfinite,
    };
  },
});
</script>
