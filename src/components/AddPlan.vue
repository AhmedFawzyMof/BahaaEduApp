<template>
  <ion-loading
    :is-open="loading"
    :message="'انتظر من فضلك...'"
    @didDismiss="loading = false"
  ></ion-loading>
  <div dir="rtl width: 100%">
    <ion-card v-if="showInputs" dir="rtl">
      <ion-card-content>
        <ion-input
          label="اسم المادة الدراسية"
          label-placement="stacked"
          v-model="subject"
          placeholder="أدخل اسم المادة الدراسية لإنشاء خطة دراسية"
        ></ion-input>
        <ion-button expand="block" color="primary" @click="GenratePlan">
          إنشاء
        </ion-button>
        <pre contenteditable="true" v-if="aiResponse.length > 0">
          {{ aiResponse }}
        </pre>
        <ion-button
          v-if="aiResponse.length > 0"
          color="danger"
          @click="SavePlan"
          >حفظ</ion-button
        >
      </ion-card-content>
    </ion-card>
    <ion-button
      expand="block"
      @click="showInputs = !showInputs"
      style="margin: 0 10px"
    >
      أضف خطة دراسية لهذا الطالب
    </ion-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonLoading,
} from "@ionic/vue";
import { BaseUrl } from "../utils/BaseUrl";

export default defineComponent({
  name: "AddPlan",
  components: { IonButton, IonCard, IonCardContent, IonInput, IonLoading },
  props: {
    student_id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const showInputs = ref<boolean>(false);
    const subject = ref<string>("");
    const aiResponse = ref<string>("");
    const loading = ref<boolean>(false);

    const GenratePlan = () => {
      if (subject.value === "") {
        return;
      }

      loading.value = true;
      fetch(`${BaseUrl}/student/plans/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.value,
          student_id: props.student_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          aiResponse.value = data.response;
          loading.value = false;
        });
    };

    const SavePlan = () => {
      loading.value = true;
      fetch(`${BaseUrl}/student/plans/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: aiResponse.value,
          student_id: props.student_id,
          subject: subject.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          loading.value = false;
        });
    };

    return {
      showInputs,
      subject,
      aiResponse,
      loading,
      GenratePlan,
      SavePlan,
    };
  },
});
</script>
<style>
pre {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
  white-space: pre-wrap;
  border-radius: 5px;
}
</style>
