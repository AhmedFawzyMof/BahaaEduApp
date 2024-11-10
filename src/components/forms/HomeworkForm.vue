<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات الواجب</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating" style="font-family: Cairo"
          >عنوان الواجب المنزلي</ion-label
        >
        <ion-input type="text" v-model="homework.homework_name"></ion-input>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="homework.grade"
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
          v-model="homework.term_id"
          placeholder="اختر فترة/ترم"
          dir="rtl"
        >
          <ion-select-option v-for="t in Terms" :key="t.id" :value="t.id">
            {{ t.term_name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 1rem"
        >
          اظهره في
        </ion-label>
        <ion-input type="datetime-local" v-model="homework.created_at" />
      </ion-item>

      <ion-item v-if="!isEdit">
        <div class="input">
          <label for="cover"> صورة الغلاف </label>
          <input type="file" id="cover" @change="handleFileChange" />
        </div>
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
import { Http } from "@capacitor-community/http";
import { BaseUrl } from "../../utils/BaseUrl";
import { homeworkType, GradeType, TermType } from "../../utils/Types";

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
  name: "HomeworkForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Homework: Object,
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
    const homework = ref<homeworkType>({
      id: 0,
      homework_name: "",
      grade: 0,
      created_at: "",
      term_id: 0,
      cover: null,
    });

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function handleFileChange(event: any) {
      const file = event.target.files[0];
      console.log(event);
      if (file) {
        homework.value.cover = file;
      } else {
        homework.value.cover = null;
      }
    }

    function submitForm() {
      let url = BaseUrl + "/homeworks/create";

      if (props.isEdit) {
        url = BaseUrl + "/homeworks/updates";
      }

      for (const key of Object.keys(homework.value)) {
        if (!props.isEdit) {
          if (key === "cover") {
            continue;
          }
          OpenAlert.value = true;
          header.value = "خطأ";
          sub_header.value = "لقد حدث خطأ ما";
          message.value = "يجب عليك تعبئة جميع الحقول";
          return;
        }
      }

      const formData = new FormData();
      formData.append("homework_name", homework.value.homework_name);
      formData.append("grade", String(homework.value.grade));
      formData.append("term_id", String(homework.value.term_id));
      formData.append("created_at", homework.value.created_at);
      if (!props.isEdit && homework.value.cover) {
        formData.append("cover", homework.value.cover);
      } else {
        formData.append("id", String(homework.value.id));
      }

      const options = {
        url: url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: formData,
      };

      Http.request({ method: "POST", ...options }).then((response) => {
        if (response.status === 401) {
          store.commit("logout");
          router.push({ name: "Login" });
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
          message.value = `تم إنشاء الواجب بنجاح بعنوان ${homework.value.homework_name}`;
        }
      });
      emit("formSubmitted", {});
    }

    watch(
      () => props.Homework,
      (newVal) => {
        if (props.isEdit && newVal) {
          homework.value.id = newVal.id;
          homework.value.homework_name = newVal.homework_name;
          homework.value.grade = newVal.grade_id;
          homework.value.created_at = newVal.created_at;
          homework.value.term_id = newVal.term_id;
        }
      },
      { immediate: true }
    );

    return {
      homework,
      store,
      router,
      OpenAlert,
      header,
      sub_header,
      message,
      alertButtons,
      setOpen,
      handleFileChange,
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
