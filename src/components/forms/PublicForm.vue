<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات الاختبار</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 15px"
          >عنوان الاختبار</ion-label
        >
        <ion-input type="text" v-model="publictest.test_name"></ion-input>
      </ion-item>

      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="publictest.grade"
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
          v-model="publictest.term_id"
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
        <ion-input type="datetime-local" v-model="publictest.created_at" />
      </ion-item>
      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 1rem"
        >
          تاريخ انتهاء الامتحان
        </ion-label>
        <ion-input type="datetime-local" v-model="publictest.expire_date" />
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
import { GradeType, TermType, publictestType } from "../../utils/Types";

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
  name: "PublicTestForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    PublicTest: Object,
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
    const publictest = ref<publictestType>({
      id: 0,
      test_name: "",
      grade: 0,
      created_at: "",
      expire_date: "",
      term_id: 0,
    });

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function submitForm() {
      let url = BaseUrl + "/public_tests/create";

      if (props.isEdit) {
        url = BaseUrl + "/public_tests/updates";
      }

      for (const key of Object.keys(publictest.value) as Array<
        keyof typeof publictest.value
      >) {
        if (!props.isEdit) {
          if (key === "id") {
            continue;
          }
          if (publictest.value[key] === "") {
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publictest.value),
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
            sub_header.value = "تم إنشاء الاختبار بنجاح";
            message.value = `تم إنشاء الاختبار بنجاح بعنوان ${publictest.value.test_name}`;
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      emit("formSubmitted", {});
    }

    watch(
      () => props.PublicTest,
      (newVal) => {
        if (!props.isEdit) {
          publictest.value = {
            id: 0,
            test_name: "",
            grade: 0,
            created_at: "",
            expire_date: "",
            term_id: 0,
          };
        }
        if (props.isEdit && newVal) {
          publictest.value.id = newVal.id;
          publictest.value.test_name = newVal.test_name;
          publictest.value.grade = newVal.grade_id;
          publictest.value.created_at = newVal.created_at;
          publictest.value.term_id = newVal.term_id;
          publictest.value.expire_date = newVal.expire_date;
        }
      },
      { immediate: true }
    );

    return {
      publictest,
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
