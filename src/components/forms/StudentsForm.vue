<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات الطالب</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating" style="font-family: Cairo"
          >اسم المستخدم</ion-label
        >
        <ion-input type="text" v-model="student.username"></ion-input>
      </ion-item>

      <ion-item v-if="!isEdit">
        <ion-label position="floating" style="font-family: Cairo"
          >كلمة المرور</ion-label
        >
        <ion-input type="password" v-model="student.password"></ion-input>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="student.grade"
          placeholder="اختر مرحلة الدراسية"
          dir="rtl"
        >
          <ion-select-option v-for="g in Grades" :key="g.id" :value="g.id">
            {{ g.grade_name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="floating" style="font-family: Cairo"
          >هاتف ولي الأمر</ion-label
        >
        <ion-input type="tel" v-model="student.parent_phone"></ion-input>
      </ion-item>

      <ion-item>
        <ion-checkbox v-model="student.isBlocked">محظور</ion-checkbox>
      </ion-item>

      <ion-item v-if="student.isBlocked">
        <ion-label position="floating" style="font-family: Cairo"
          >سبب الحظر</ion-label
        >
        <ion-textarea v-model="student.BlockReason"></ion-textarea>
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

import { studentType, GradeType } from "../../utils/Types";

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
  name: "StudentsForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Student: Object,
    Grades: {
      type: Array as () => GradeType[],
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
    const student = ref<studentType>({
      id: 0,
      username: "",
      password: "",
      grade: 0,
      isBlocked: false,
      parent_phone: "",
      BlockReason: "",
    });
    const alertButtons = ref<string[]>(["موافق"]);
    const OpenAlert = ref<boolean>(false);
    const sub_header = ref<string>("");
    const header = ref<string>("");
    const message = ref<string>("");
    const store = useStore();
    const router = useRouter();

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function submitForm() {
      let url = BaseUrl + "/student/create";

      if (props.isEdit) {
        url = BaseUrl + "/student/update";
      }

      for (const key of Object.keys(student.value)) {
        if (!props.isEdit) {
          if (
            key !== "isBlocked" &&
            key !== "BlockReason" &&
            key !== "parent_phone"
          ) {
            continue;
          }
          if (student.value[key] === "") {
            OpenAlert.value = true;
            header.value = "خطأ";
            sub_header.value = "لقد حدث خطأ ما";
            message.value = "يجب عليك تعبئة جميع الحقول";
            return;
          }
        }
      }

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(student.value),
      })
        .then((response) => {
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
            sub_header.value = "تم إنشاء طالب بنجاح";
            message.value = `تم إنشاء طالب بنجاح باسم ${student.value.username}`;
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      emit("formSubmitted");
    }

    watch(
      () => props.Student,
      (newVal) => {
        if (props.isEdit && newVal) {
          student.value.id = newVal.id;
          student.value.username = newVal.username;
          student.value.grade = newVal.grade_id;
          student.value.isBlocked = newVal.isBlocked;
          student.value.parent_phone = newVal.parent_phone;
          student.value.BlockReason = newVal.BlockReason;
        }
      },
      { immediate: true }
    );

    return {
      student,
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
