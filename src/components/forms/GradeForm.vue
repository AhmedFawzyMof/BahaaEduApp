<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات مرحلة الدراسية</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 15px"
          >عنوان مرحلة الدراسية</ion-label
        >
        <ion-input type="text" v-model="grade.grade_name"></ion-input>
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
  name: "GradesForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Grade: Object,
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
    const alertButtons = ref<string[]>(["موافق"]);
    const grade = ref<{ grade_name: string; id: number }>({
      id: 0,
      grade_name: "",
    });
    const header = ref<string>("");
    const sub_header = ref<string>("");
    const message = ref<string>("");

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function submitForm() {
      let url = `${BaseUrl}/grades/create`;

      if (props.isEdit) {
        url = `${BaseUrl}/grades/updates`;
      }

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade_name: grade.value.grade_name,
          id: grade.value.id,
        }),
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
            sub_header.value = "تم إنشاء مرحلة الدراسية بنجاح";
            message.value = `تم إنشاء مرحلة الدراسية بنجاح بعنوان ${grade.value.grade_name}`;
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      emit("formSubmitted", {});
    }

    watch(
      () => props.Grade,
      (newVal) => {
        if (props.isEdit && newVal) {
          grade.value.id = newVal.id;
          grade.value.grade_name = newVal.grade_name;
        }
      },
      { immediate: true }
    );

    return {
      store,
      router,
      OpenAlert,
      grade,
      header,
      sub_header,
      message,
      alertButtons,
      submitForm,
      setOpen,
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
