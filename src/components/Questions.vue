<template>
  <ion-card>
    <ion-card-header>
      <img
        :src="BaseUrl.slice(0, -4) + question.image"
        :alt="question.question"
        v-if="question.image"
        style="width: 100%; border-radius: 5px"
      />
      <p>
        هل هذا السؤال موجود في بنك الأسئلة: {{ question.bank ? "نعم" : "لا" }}
      </p>
      <ion-card-title>{{ question.question }}</ion-card-title>
      <div class="buttons">
        <ion-button color="danger" @click="Delete(question.id)">
          <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    </ion-card-header>
    <ion-card-content>
      <div
        v-if="showChoices()"
        class="choice"
        v-for="choice in question.choices"
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
        v-for="answer in question.inputs"
        :key="answer"
      >
        <p>{{ answer }}</p>
      </div>
    </ion-card-content>
  </ion-card>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { BaseUrl } from "@/utils/BaseUrl";

import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
} from "@ionic/vue";

import {
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  trashOutline,
  checkmarkOutline,
  checkmarkDoneOutline,
} from "ionicons/icons";

export default defineComponent({
  name: "GeneralQuestions",
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  components: {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
  },
  emits: ["delete"],
  setup(props, { emit }) {
    function showChoices() {
      if (props.question.choices === null) {
        return false;
      }
      return true;
    }

    function Delete(id: number) {
      emit("delete", id);
    }

    return {
      checkmarkCircleOutline,
      closeCircleOutline,
      createOutline,
      trashOutline,
      checkmarkOutline,
      checkmarkDoneOutline,
      BaseUrl,
      showChoices,
      Delete,
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
