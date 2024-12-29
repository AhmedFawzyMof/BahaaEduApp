<template>
  <div class="questionConnector" v-if="questionList.length > 0">
    <ion-card>
      <ion-card-content>
        <ion-select
          label="اختر ما تريد ربط السؤال به"
          label-placement="stacked"
          placeholder="إختر واحدا"
          dir="rtl"
          v-model="typeToConnect"
          v-if="Stage > 0 && Term > 0"
          @ionChange="getTypeDataList()"
        >
          <ion-select-option v-for="o in TypeList" :key="o.value" :value="o">
            {{ o.name }}
          </ion-select-option>
        </ion-select>
      </ion-card-content>
    </ion-card>
    <ion-card v-if="dataList.length > 0">
      <ion-card-content>
        <ion-select
          :label="`اختر من ${typeToConnect.name}`"
          label-placement="stacked"
          v-model="dataId"
          dir="rtl"
        >
          <ion-select-option v-for="t in dataList" :key="t.id" :value="t.id">
            {{
              (typeToConnect.value === "homework" && t.homework_name) ||
              (typeToConnect.value === "test" && t.test_name) ||
              (typeToConnect.value === "publictest" && t.test_name) ||
              (typeToConnect.value === "videos" && t.video_name)
            }}
          </ion-select-option>
        </ion-select>
      </ion-card-content>
    </ion-card>
    <ion-button
      color="primary"
      expand="block"
      style="margin: 0 10px"
      @click="connectQuestion()"
      v-if="dataId > 0"
    >
      <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
      <p style="margin-left: 10px">ربط السؤال</p>
    </ion-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
} from "@ionic/vue";

import { addCircleOutline } from "ionicons/icons";

import { BaseUrl } from "@/utils/BaseUrl";

export default defineComponent({
  name: "QuestionConnect",
  props: {
    questionList: {
      type: Array,
      required: true,
    },
    Stage: {
      type: Number,
      required: true,
    },
    Term: {
      type: Number,
      required: true,
    },
  },
  components: {
    IonCard,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
  },
  emits: ["formSubmitted"],
  setup(props) {
    const typeToConnect = ref<any>({});
    const TypeList = ref<{ name: string; value: string }[]>([
      { name: "الواجبات المنزلية", value: "homework" },
      { name: "الامتحانات", value: "test" },
      { name: "فيديوهات", value: "videos" },
      { name: "الاختبارات العامة", value: "publictest" },
    ]);
    const dataList = ref<{ [key: string]: string | number }[]>([]);
    const dataId = ref<number>(0);

    function getTypeDataList() {
      const url = `${BaseUrl}/questions/connect/${typeToConnect.value.value}/${props.Stage}/${props.Term}`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dataList.value = data;
        });
    }

    function connectQuestion() {
      const url = `${BaseUrl}/questions/connect`;

      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: props.questionList,
          type: typeToConnect.value.value,
          data_id: dataId.value,
        }),
      });
    }

    return {
      TypeList,
      typeToConnect,
      dataList,
      dataId,
      addCircleOutline,
      getTypeDataList,
      connectQuestion,
    };
  },
});
</script>
