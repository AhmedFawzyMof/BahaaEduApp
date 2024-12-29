<template>
  <ion-card dir="rtl" v-if="isOpen">
    <ion-card-header>
      <ion-card-title>بيانات السؤال</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item dir="ltr">
        <ion-select
          label="مرحلة الدراسية"
          label-placement="stacked"
          v-model="question.grade_id"
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
          v-model="question.term_id"
          placeholder="اختر فترة/ترم"
          dir="rtl"
        >
          <ion-select-option :value="1">
            الفصل الدراسي الاول
          </ion-select-option>
          <ion-select-option :value="2">
            الفصل الدراسي الثاني
          </ion-select-option>
          <ion-select-option :value="3"> لا يوجد فصل دراسي </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-checkbox v-model="question.bank">
          إضافة السؤال إلى بنك الأسئلة
        </ion-checkbox>
      </ion-item>

      <ion-item v-if="!isEdit">
        <div class="input">
          <label> صورة الغلاف </label>
          <input type="file" @change="handleFileChange" />
        </div>
      </ion-item>

      <ion-item>
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 1rem"
        >
          السؤال
        </ion-label>
        <ion-input type="text" v-model="question.question"></ion-input>
      </ion-item>

      <ion-item>
        <ion-select
          label="نوع السؤال"
          label-placement="stacked"
          v-model="questionType"
          placeholder="اختر نوع السؤال"
          dir="rtl"
        >
          <ion-select-option value="multiple-choice">
            أسئلة اختيارية
          </ion-select-option>
          <ion-select-option value="input"> أسئلة نصية </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item
        v-for="i in ArrayOfNumber()"
        v-if="questionType === 'multiple-choice'"
      >
        <div class="choice">
          <input
            type="text"
            v-model="choices[i]"
            :placeholder="`اختيار ${i}`"
          />
          <input
            type="radio"
            name="choice-radio"
            :value="i"
            v-model="selectedChoice"
            id="choice"
          />
        </div>
      </ion-item>
      <ion-item v-if="questionType === 'input'">
        <ion-label
          position="floating"
          style="font-family: Cairo; margin-bottom: 1rem"
        >
          عدد الاجابات
        </ion-label>
        <ion-input type="number" v-model="numberOfInputs"></ion-input>
      </ion-item>

      <ion-item
        v-for="i in ArrayOfNumber(numberOfInputs)"
        v-if="questionType === 'input'"
      >
        <div class="inputs">
          <input
            type="text"
            v-model="inputs[i]"
            :placeholder="`الإجابة ${i}`"
          />
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
import { BaseUrl } from "../../utils/BaseUrl";
import { GradeType, TermType, questionType } from "../../utils/Types";

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
  name: "QuestionForm",
  props: {
    isOpen: Boolean,
    isEdit: Boolean,
    Question: Object,
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
    const question = ref<questionType>({
      id: 0,
      question: "",
      grade_id: 0,
      term_id: 0,
      bank: false,
      image: null,
    });
    const questionType = ref<string>("");
    const choices = ref<string[]>([]);
    const inputs = ref<string[]>([]);
    const selectedChoice = ref<number>(0);
    const numberOfInputs = ref<number>(0);

    function ArrayOfNumber(length?: number) {
      if (!length) {
        length = 4;
      }
      return Array.from({ length }, (_, i) => i + 1);
    }

    function setOpen(isOpen: boolean) {
      OpenAlert.value = isOpen;
    }

    function handleFileChange(event: any) {
      const file = event.target.files[0];
      if (file) {
        question.value.image = file;
      } else {
        question.value.image = null;
      }
    }

    function setSelectedAnswer(i: number) {
      selectedChoice.value = i;
    }

    function submitForm() {
      let url = BaseUrl + "/questions/create";

      if (props.isEdit) {
        url = BaseUrl + "/questions/updates";
      }

      for (const key of Object.keys(question.value) as Array<
        keyof typeof question.value
      >) {
        if (!props.isEdit) {
          if (key === "image" || key === "id") {
            continue;
          }
          if (question.value[key] === "") {
            OpenAlert.value = true;
            header.value = "خطأ";
            sub_header.value = "لقد حدث خطأ ما";
            message.value = "يجب عليك تعبئة جميع الحقول";
            return;
          }
        }
      }

      const formData = new FormData();
      const inputChoices: object[] = [];
      if (questionType.value === "multiple-choice") {
        choices.value.forEach((choice, index) => {
          if (index === selectedChoice.value) {
            inputChoices.push({ choice, is_correct: true });
          } else {
            inputChoices.push({ choice, is_correct: false });
          }
        });
        formData.append("choices", JSON.stringify(inputChoices));
      }
      if (questionType.value === "input") {
        inputs.value.forEach((input) => {
          inputChoices.push({ input });
        });
        formData.append("inputs", JSON.stringify(inputChoices));
      }
      formData.append("question_type", questionType.value);
      formData.append("question", question.value.question);
      formData.append("grade_id", String(question.value.grade_id));
      formData.append("term_id", String(question.value.term_id));
      formData.append("bank", String(question.value.bank));
      if (!props.isEdit && question.value.image) {
        formData.append("image", question.value.image);
      } else {
        formData.append("id", String(question.value.id));
      }

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
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
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      emit("formSubmitted", {});
    }

    watch(
      () => props.Question,
      (newVal) => {
        if (props.isEdit && newVal) {
          let type = false;
          if (newVal.choices.length === 1) {
            if (newVal.choices[0] === null) {
              type = false;
            }
          } else {
            type = true;
          }
          question.value.id = newVal.id;
          question.value.question = newVal.question;
          question.value.bank = newVal.bank;
          question.value.grade_id = newVal.grade_id;
          question.value.term_id = newVal.term_id;
          questionType.value = type ? "multiple-choice" : "input";
          if (questionType.value === "multiple-choice") {
            newVal.choices.forEach(
              (choice: { choice: string; is_right: boolean }, i: number) => {
                choices.value[i + 1] = choice.choice;
                if (choice.is_right) {
                  selectedChoice.value = i + 1;
                }
              }
            );
            return;
          }
          numberOfInputs.value = newVal.the_answer.length;
          newVal.the_answer.forEach((answer: string, i: number) => {
            inputs.value[i + 1] = answer;
          });
        }
      },
      { immediate: true }
    );

    return {
      questionType,
      question,
      store,
      router,
      OpenAlert,
      header,
      sub_header,
      message,
      alertButtons,
      choices,
      selectedChoice,
      numberOfInputs,
      inputs,
      setOpen,
      submitForm,
      handleFileChange,
      ArrayOfNumber,
      setSelectedAnswer,
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

.choice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}
.choice input[type="text"] {
  width: 80%;
  border: none;
  border-bottom: 2px solid var(--ion-color-primary);
}
.choice input[type="radio"] {
  width: 20%;
}

.inputs {
  display: flex;
  width: 100%;
}

.inputs input {
  width: 100%;
  border: none;
  border-bottom: 2px solid var(--ion-color-primary);
}
</style>
