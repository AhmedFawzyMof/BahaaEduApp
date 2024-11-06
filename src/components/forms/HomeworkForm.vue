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
  name: "HomeworkForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Homework: Object,
    Grades: Array,
    Terms: Array,
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
      homework: {
        homework_name: "",
        grade: 0,
        created_at: "",
        term_id: "",
        cover: null,
      },
      alertButtons: ["موافق"],
      OpenAlert: false,
      sub_header: "",
      header: "",
      message: "",
    };
  },
  watch: {
    Homework: {
      immediate: true,
      handler(newVal) {
        console.log(newVal);
        if (this.isEdit && newVal) {
          this.homework.id = newVal.id;
          this.homework.homework_name = newVal.homework_name;
          this.homework.grade = newVal.grade_id;
          this.homework.created_at = newVal.created_at;
          this.homework.term_id = newVal.term_id;
        }
      },
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      console.log(event);
      if (file) {
        this.homework.cover = file; // Store the file object
      } else {
        this.homework.cover = null; // Reset if no file is selected
      }
    },
    setOpen(isOpen) {
      this.OpenAlert = isOpen;
    },
    submitForm() {
      let url = "/homeworks/create";

      if (this.isEdit) {
        url = "/homeworks/updates";
      }

      for (const key of Object.keys(this.homework)) {
        if (!this.isEdit) {
          if (this.homework[key] === "") {
            this.OpenAlert = true;
            this.header = "خطأ";
            this.sub_header = "لقد حدث خطأ ما";
            this.message = "يجب عليك تعبئة جميع الحقول";
            return;
          }
        }
      }

      const formData = new FormData();
      formData.append("homework_name", this.homework.homework_name);
      formData.append("grade", this.homework.grade);
      formData.append("term_id", this.homework.term_id);
      formData.append("created_at", this.homework.created_at);
      if (!this.isEdit) {
        formData.append("cover", this.homework.cover);
      } else {
        formData.append("id", this.Homework.id);
      }

      axios
        .post(url, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(async (response) => {
          if (!this.isEdit) {
            this.OpenAlert = true;
            this.header = "تمت العملية بنجاح";
            this.sub_header = "تم إنشاء الواجب بنجاح";
            this.message = `تم إنشاء الواجب بنجاح بعنوان ${this.homework.homework_name}`;
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
