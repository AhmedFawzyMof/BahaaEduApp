<template>
  <ion-page>
    <Header />
    <ion-content>
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
      <ion-card>
        <ion-card-content>
          <ion-select
            label="فصول الدراسية"
            label-placement="stacked"
            placeholder="اختر فصل دراسي"
            dir="rtl"
            v-model="term"
          >
            <ion-select-option v-for="t in terms" :key="t.id" :value="t.id">
              {{ t.term_name }}
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
        <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
        <p style="margin-left: 10px">اضافة فيديو</p>
      </ion-button>
      <VideoForm
        :isOpen="openAdd"
        :isEdit="edit"
        :Video="video"
        :Grades="academicStages"
        :Terms="terms"
        @formSubmitted="getVideos"
      />
      <ion-card dir="rtl" v-if="stage !== 0">
        <ion-card-header>
          <ion-card-title>قائمة الواجبات</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <DataTable
            :Data="videos"
            :Grades="academicStages"
            :Terms="terms"
            Type="videos"
            :Edit="edit"
            :RefReshFunc="getVideos"
            @edit="editVideo"
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
import DataTable from "@/components/DataTable.vue";
import VideoForm from "@/components/forms/VideoForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonCardHeader,
  IonCardTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import { addCircleOutline } from "ionicons/icons";

export default defineComponent({
  name: "Videos",
  components: {
    Header,
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    DataTable,
    VideoForm,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const academicStages = ref<Array<any>>([]);
    const videos = ref<Array<any>>([]);
    const stage = ref(0);
    const limit = ref(30);
    const openAdd = ref(false);
    const edit = ref(false);
    const video = ref({});

    onMounted(() => {
      store.commit("isLoggedIn", router);
      getVideos();
    });

    const terms = ref([
      { id: 1, term_name: "الاول" },
      { id: 2, term_name: "الثاني" },
      { id: 3, term_name: "لا يوجد" },
    ]);
    const term = ref<number>(0);

    const getVideos = async () => {
      const token = localStorage.getItem("token") || "";

      fetch(
        `${BaseUrl}/videos/getall/${stage.value}/${term.value}/${limit.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
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

            if (videos.value.length === 0) {
              videos.value = data.videos;
            }

            if (videos.value.length === 30 || videos.value.length > 30) {
              videos.value.push(...data.videos);
            }

            if (data.videos.length === 0) {
              return;
            }
          }
        });
    };

    const openAddModal = (isOpen: boolean) => {
      openAdd.value = isOpen;
      video.value = {};
      edit.value = false;
    };

    const editVideo = (data: any) => {
      edit.value = data.edit;
      video.value = data.edit ? data.instace : {};
      openAdd.value = data.edit;
    };

    const ionInfinite = (ev: InfiniteScrollCustomEvent) => {
      if (videos.value.length < 30) {
        ev.target.disabled = true;
        return;
      }
      limit.value += 30;
      getVideos();
      setTimeout(() => ev.target.complete(), 500);
    };

    const showVideo = (id: number) => {
      router.push(`/video/${id}`);
    };

    watch(stage, getVideos);
    watch(limit, getVideos);
    watch(term, getVideos);

    return {
      terms,
      term,
      stage,
      limit,
      academicStages,
      addCircleOutline,
      videos,
      openAdd,
      edit,
      video,
      openAddModal,
      editVideo,
      getVideos,
      showVideo,
      ionInfinite,
    };
  },
});
</script>
