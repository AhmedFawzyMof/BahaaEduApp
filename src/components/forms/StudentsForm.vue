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
  name: "StudentsForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Student: Object,
    Grades: Array,
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
      student: {
        username: this.isEdit ? this.Student.username : "",
        password: "",
        grade: this.isEdit ? this.Student.grade_id : 0,
        isBlocked: this.isEdit ? this.Student.isBlocked : false,
        parent_phone: this.isEdit ? this.Student.parent_phone : "",
        BlockReason: this.isEdit ? this.Student.BlockReason : "",
      },
      alertButtons: ["موافق"],
      OpenAlert: false,
      sub_header: "",
      header: "",
      message: "",
    };
  },
  watch: {
    Student: {
      immediate: true,
      handler(newVal) {
        if (this.isEdit && newVal) {
          this.student.id = newVal.id;
          this.student.username = newVal.username;
          this.student.grade = newVal.grade_id;
          this.student.isBlocked = newVal.isBlocked;
          this.student.parent_phone = newVal.parent_phone;
          this.student.BlockReason = newVal.BlockReason;
        }
      },
    },
  },
  methods: {
    setOpen(isOpen) {
      this.OpenAlert = isOpen;
    },
    submitForm() {
      let url = "/student/create";

      if (this.isEdit) {
        url = "/student/update";
      }

      for (const key of Object.keys(this.student)) {
        if (
          key !== "isBlocked" &&
          key !== "BlockReason" &&
          key !== "parent_phone"
        ) {
          if (!this.isEdit) {
            if (this.student[key] === "") {
              this.OpenAlert = true;
              this.header = "خطأ";
              this.sub_header = "لقد حدث خطأ ما";
              this.message = "يجب عليك تعبئة جميع الحقول";
              return;
            }
          }
        }
      }

      axios
        .post(url, this.student, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(async (response) => {
          this.OpenAlert = true;
          this.header = "تمت العملية بنجاح";
          this.sub_header = "تم إنشاء الطالب بنجاح";
          this.message = `تم إنشاء الطالب بنجاح باسم ${
            this.student.username
          } من ${Grades[this.student.grade].grade_name}`;
        })
        .catch((error) => {
          if (error.status == 401) {
            this.OpenAlert = true;
            this.header = "خطأ";
            this.sub_header = "لقد حدث خطأ ما";
            this.message = "حدث خطأ ما، يرجى المحاولة مرة أخرى";
            this.$store.commit("logout");
            this.$router.push({ name: "Login" });
          }
        });
      this.$emit("formSubmitted", {});
    },
  },
};
</script>
