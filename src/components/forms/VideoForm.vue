<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات الفيديو</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 15px"
          >عنوان الفيديو</ion-label
        >
        <ion-input type="text" v-model="video.title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 15px"
          >عنوان الرابط</ion-label
        >
        <ion-input type="text" v-model="video.link"></ion-input>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="video.grade_id"
          placeholder="اختر مرحلة الدراسية"
          dir="rtl"
        >
          <ion-select-option v-for="g in Grades" :key="g.id" :value="g.id">
            {{ g.grade_name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="video.term_id"
          placeholder="اختر فترة/ترم"
          dir="rtl"
        >
          <ion-select-option v-for="t in Terms" :key="t.id" :value="t.id">
            {{ t.term_name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-button expand="block" color="primary" @click="submitForm">
        {{ isEdit ? "تعديل" : "اضافة" }}
      </ion-button>
    </ion-card-content>
  </ion-card>
  <ion-alert
    :is-open="OpenAlert"
    :header="header"
    :sub-header="sub_header"
    :message="message"
    :buttons="alertButtons"
    @didDismiss="setOpen(false)"
  ></ion-alert>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../../utils/BaseUrl";
import { videoType, GradeType, TermType } from "../../utils/Types";

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonButton,
  IonTextarea,
  IonCheckbox,
  IonAlert,
} from "@ionic/vue";

export default defineComponent({
  name: "VideoForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Video: Object,
    Grades: {
      type: Array as () => GradeType[],
      required: true,
    },
    Terms: {
      type: Array as () => TermType[],
      required: true,
    },
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonButton,
    IonTextarea,
    IonCheckbox,
    IonAlert,
  },
  emits: ["formSubmitted"],
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const OpenAlert = ref<boolean>(false);
    const header = ref<string>("");
    const sub_header = ref<string>("");
    const message = ref<string>("");
    const alertButtons = ref<string[]>(["موافق"]);
    const video = ref<videoType>({
      id: 0,
      title: "",
      link: "",
      grade_id: 0,
      term_id: 0,
    });

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function submitForm() {
      let url = BaseUrl + "/videos/create";

      const formData: videoType = {
        title: video.value.title,
        link: video.value.link,
        grade_id: video.value.grade_id,
        term_id: video.value.term_id,
      };

      if (props.isEdit) {
        url = BaseUrl + "/videos/updates";
        formData.id = video.value.id;
      }

      for (const key of Object.keys(video.value) as Array<
        keyof typeof video.value
      >) {
        if (!props.isEdit) {
          if (video.value[key] === "") {
            OpenAlert.value = true;
            header.value = "خطأ";
            sub_header.value = "لقد حدث خطأ ما";
            message.value = "يجب عليك تعبئة جميع الحقول";
            return;
          }
        }
      }

      console.log(formData);

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          console.log(response);
          if (response.status === 401) {
            store.commit("logout");
            router.push("/login");
            return;
          }
          if (response.status === 500) {
            OpenAlert.value = true;
            header.value = "خطأ";
            sub_header.value = "خطأ غير متوقع";
            message.value = "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.";
          }
          if (!props.isEdit) {
            OpenAlert.value = true;
            header.value = "تمت العملية بنجاح";
            sub_header.value = "تم إنشاء الواجب بنجاح";
            message.value = `تم إنشاء الواجب بنجاح بعنوان ${video.value.title}`;
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      emit("formSubmitted", {});
    }

    watch(
      () => props.Video,
      (newVal) => {
        if (!props.isEdit) {
          video.value = {
            id: 0,
            title: "",
            link: "",
            grade_id: 0,
            term_id: 0,
          };
        }
        if (props.isEdit && newVal) {
          video.value.id = newVal.id;
          video.value.title = newVal.title;
          video.value.link = newVal.link;
          video.value.grade_id = newVal.grade_id;
          video.value.term_id = newVal.term_id;
        }
      },
      { immediate: true }
    );

    return {
      video,
      store,
      router,
      OpenAlert,
      header,
      sub_header,
      message,
      alertButtons,
      setOpen,
      submitForm,
    };
  },
});
</script>
<style>
.input {
  display: flex;
  align-items: start;
  flex-direction: column;
}
</style>
