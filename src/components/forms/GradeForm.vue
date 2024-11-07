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
<script>
import axios from "axios";
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

export default {
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
  data() {
    return {
      grade: {
        grade_name: "",
      },
      alertButtons: ["موافق"],
      OpenAlert: false,
      sub_header: "",
      header: "",
      message: "",
    };
  },
  watch: {
    Grade: {
      immediate: true,
      handler(newVal) {
        console.log(newVal);
        if (this.isEdit && newVal) {
          this.grade.id = newVal.id;
          this.grade.grade_name = newVal.grade_name;
        }
      },
    },
  },
  methods: {
    setOpen(isOpen) {
      this.OpenAlert = isOpen;
    },
    submitForm() {
      let url = "/grades/create";

      if (this.isEdit) {
        url = "/grades/updates";
      }

      const body = this.grade;

      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(async (response) => {
          if (!this.isEdit) {
            this.OpenAlert = true;
            this.header = "تمت العملية بنجاح";
            this.sub_header = "تم إنشاء مرحلة الدراسية بنجاح";
            this.message = `تم إنشاء مرحلة الدراسية بنجاح بعنوان ${this.grade.grade_name}`;
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.OpenAlert = true;
            this.header = "خطأ";
            this.sub_header = "لقد حدث خطأ ما";
            this.message = "حدث خطأ ما، يرجى المحاولة مرة أخرى";
            this.$store.commit("logout");
            this.$router.push({ name: "Login" });
          } else {
            this.OpenAlert = true;
            this.header = "خطأ";
            this.sub_header = "خطأ غير متوقع";
            this.message = "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.";
          }
        });
      this.$emit("formSubmitted", {});
    },
  },
};
</script>
<style>
.input {
  display: flex;
  align-items: start;
  flex-direction: column;
}
</style>
