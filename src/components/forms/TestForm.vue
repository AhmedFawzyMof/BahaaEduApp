<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات الاختبار</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating" style="font-family: Cairo"
          >عنوان الاختبار</ion-label
        >
        <ion-input type="text" v-model="test.test_name"></ion-input>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="test.grade"
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
          v-model="test.term_id"
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
        <ion-input type="datetime-local" v-model="test.created_at" />
      </ion-item>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 1rem"
        >
          تاريخ انتهاء الامتحان
        </ion-label>
        <ion-input type="datetime-local" v-model="test.expire_date" />
      </ion-item>

      <ion-item v-if="!isEdit">
        <div class="input">
          <label> صورة الغلاف </label>
          <input type="file" @change="handleFileChange" />
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
  name: "TestForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Test: Object,
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
      test: {
        test_name: "",
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
    Test: {
      immediate: true,
      handler(newVal) {
        console.log(newVal);
        if (this.isEdit && newVal) {
          this.test.id = newVal.id;
          this.test.test_name = newVal.test_name;
          this.test.grade = newVal.grade_id;
          this.test.created_at = newVal.created_at;
          this.test.term_id = newVal.term_id;
        }
      },
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      console.log(event);
      if (file) {
        this.test.cover = file; // Store the file object
      } else {
        this.test.cover = null; // Reset if no file is selected
      }
    },
    setOpen(isOpen) {
      this.OpenAlert = isOpen;
    },
    submitForm() {
      let url = "/tests/create";

      if (this.isEdit) {
        url = "/tests/updates";
      }

      for (const key of Object.keys(this.test)) {
        if (!this.isEdit) {
          if (this.test[key] === "") {
            this.OpenAlert = true;
            this.header = "خطأ";
            this.sub_header = "لقد حدث خطأ ما";
            this.message = "يجب عليك تعبئة جميع الحقول";
            return;
          }
        }
      }

      const formData = new FormData();
      formData.append("test_name", this.test.test_name);
      formData.append("grade", this.test.grade);
      formData.append("term_id", this.test.term_id);
      formData.append("created_at", this.test.created_at);
      if (!this.isEdit) {
        formData.append("cover", this.test.cover);
      } else {
        formData.append("id", this.test.id);
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
            this.sub_header = "تم إنشاء الاختبار بنجاح";
            this.message = `تم إنشاء الاختبار بنجاح بعنوان ${this.test.test_name}`;
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
