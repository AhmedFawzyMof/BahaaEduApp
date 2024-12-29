<template>
  <ion-card dir="rtl">
    <Bar :data="chartData" :options="options" />
  </ion-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { IonCard } from "@ionic/vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
} from "chart.js";
import { Bar } from "vue-chartjs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: "Chart",
  props: {
    chartData: {
      type: Object as () => ChartData<"bar">,
      required: true,
    },
  },
  components: {
    Bar,
    IonCard,
  },
  setup(props) {
    const options = ref({
      responsive: true,
      maintainAspectRatio: true,
    });

    return {
      options,
    };
  },
});
</script>
