<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ question.question }}</ion-card-title>
      <div class="buttons"></div>
    </ion-card-header>
    <ion-card-content>
      <div class="student_answers">
        <p>اجابات الطالب</p>
        <div v-if="showChoices()" class="choice">
          <p>{{ question.student_answer[0].choice_answer }}</p>
          <ion-icon
            slot="icon-only"
            :icon="
              question.is_student_answer_right[0]
                ? checkmarkCircleOutline
                : closeCircleOutline
            "
            style="font-size: 15px"
            :color="question.is_student_answer_right[0] ? 'success' : 'danger'"
          ></ion-icon>
        </div>
        <div class="choice_correct" v-if="showChoices()">
          <ion-button
            :color="question.is_student_answer_right[0] ? 'danger' : 'success'"
            @click="
              MarkAnswer(
                question.student_answer[0].id,
                question.is_student_answer_right[0] ? false : true
              )
            "
          >
            {{
              question.is_student_answer_right[0]
                ? "صحح الإجابة بأنها خاطئة"
                : "صحح الإجابة بأنها صحيحة"
            }}
          </ion-button>
        </div>
        <div class="text" v-if="!showChoices()">
          <div
            class="text_answer"
            v-for="(answer, index) in question.student_answer"
            :key="answer.id"
          >
            <p>{{ answer.text_answer }}</p>
            <ion-button
              :color="
                question.is_student_answer_right[index] ? 'danger' : 'success'
              "
              @click="
                MarkAnswer(
                  answer.id,
                  question.is_student_answer_right[index] ? false : true
                )
              "
            >
              {{
                question.is_student_answer_right[index]
                  ? "صحح الإجابة بأنها خاطئة"
                  : "صحح الإجابة بأنها صحيحة"
              }}</ion-button
            >
          </div>
        </div>
      </div>
      <p>الاجابات الصحيحة</p>
      <div
        v-if="showChoices()"
        class="choice"
        v-for="choice in question.the_choice"
        :key="choice.choice"
      >
        <p>{{ choice.choice }}</p>
        <ion-icon
          slot="icon-only"
          :icon="choice.is_right ? checkmarkCircleOutline : closeCircleOutline"
          style="font-size: 15px"
          :color="choice.is_right ? 'success' : 'danger'"
        ></ion-icon>
      </div>
      <div
        v-if="!showChoices()"
        class="text_answer"
        v-for="answer in question.the_answer"
        :key="answer"
      >
        <p>{{ answer }}</p>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BaseUrl } from "../utils/BaseUrl";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons";

export default defineComponent({
  name: "Answers",
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },
  emits: ["mark"],
  setup(props, { emit }) {
    function showChoices() {
      if (props.question.the_choice === null) {
        return false;
      }
      return true;
    }

    function MarkAnswer(answer_id: number, right: boolean) {
      fetch(`${BaseUrl}/teacher/marking/${props.type}/${props.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          answer_id,
          right,
        }),
      }).then((response) => response.json());
      emit("mark");
    }

    return {
      BaseUrl,
      checkmarkCircleOutline,
      closeCircleOutline,
      showChoices,
      MarkAnswer,
    };
  },
});
</script>

<style>
.choice {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 0 3px #00000033;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.choice p {
  font-size: 15px;
}

.text_answer {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 0 3px #00000033;
}
.text_answer p {
  font-size: 15px;
}

.check {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  font-size: 25px;
}
</style>
