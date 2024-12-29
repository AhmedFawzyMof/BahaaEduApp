<template>
  <div class="tableContainer">
    <div class="tableWrapper" v-if="Data.length > 0">
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th v-if="Type !== 'videos'">
              {{
                (Type === "homework" && "تاريخ الواجب") ||
                (Type === "test" && "تاريخ الامتحان") ||
                (Type === "public_test" && "تاريخ الامتحان") ||
                (Type === "student" && "تم حظره")
              }}
            </th>
            <th v-if="Type === 'test' || Type === 'public_test'">
              تاريخ نهاية الامتحان
            </th>
            <th>
              {{ Type === "student" ? "هاتف ولي الامر" : "مرحلة الدراسية" }}
            </th>
            <th>{{ Type === "student" ? "سبب الحظر" : "الصف الدراسي" }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(d, index) in Data"
            :key="index"
            :class="`${index === Data.length - 1 ? 'lastRow' : ''}`"
          >
            <td>
              {{
                (Type === "student" && d.username) ||
                (Type === "homework" && d.homework_name) ||
                (Type === "test" && d.test_name) ||
                (Type === "public_test" && d.test_name) ||
                (Type === "videos" && d.title)
              }}
            </td>
            <td v-if="Type !== 'videos'">
              {{
                Type === "student"
                  ? `${d.isBlocked === 1 ? "نعم" : "لا"}`
                  : d.created_at.replace("T", " | ")
              }}
            </td>
            <td v-if="Type === 'test' || Type === 'public_test'">
              {{ d.expire_date.replace("T", " | ") }}
            </td>
            <td v-if="Type !== 'student'">{{ grade(d.grade_id) }}</td>
            <td v-else>
              <a :href="`https://wa.me/+2${d.parent_phone}?`">{{
                d.parent_phone
              }}</a>
            </td>
            <td v-if="Type !== 'student'">{{ term(d.term_id) }}</td>
            <td v-else>
              {{ d.isBlocked === 1 ? d.BlockReason : "" }}
            </td>
            <td>
              <div class="buttons">
                <ion-button @click="EditData(d, !Edit)">
                  <ion-icon :icon="createOutlineIcon" />
                </ion-button>
                <ion-button color="danger" @click="DeleteData(d.id)">
                  <ion-icon :icon="trashOutlineIcon" />
                </ion-button>
                <ion-button color="secondary" @click="ShowData(d.id)">
                  <ion-icon :icon="eyeOutlineIcon" />
                </ion-button>
                <ion-button
                  v-if="Type === 'public_test'"
                  color="secondary"
                  @click="
                    QRCodeGen(BaseUrl.slice(0, -4) + '/publictest/' + d.id)
                  "
                >
                  <ion-icon :icon="qrCodeOutlineIcon"
                /></ion-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="noData" v-else>
      <p>لا توجد بيانات حتى الان</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  createOutline,
  trashOutline,
  eyeOutline,
  qrCodeOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "../utils/BaseUrl";
import { IonCol, IonGrid, IonRow, IonButton, IonIcon } from "@ionic/vue";

export default defineComponent({
  name: "DataTable",
  props: {
    Grades: {
      type: Array<any>,
    },
    Terms: {
      type: Array<any>,
    },
    Data: {
      type: Array<any>,
      required: true,
    },
    Type: {
      type: String,
      required: true,
    },
    Edit: {
      type: Boolean,
      required: true,
    },
    RefReshFunc: {
      type: Function,
      required: true,
    },
  },
  components: {
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
    IonIcon,
  },
  emits: ["edit", "qrcode"],
  setup(props, { emit }) {
    const createOutlineIcon = createOutline;
    const trashOutlineIcon = trashOutline;
    const eyeOutlineIcon = eyeOutline;
    const qrCodeOutlineIcon = qrCodeOutline;
    const store = useStore();
    const router = useRouter();

    const grade = (id: number) => {
      const stageData = props.Grades?.find((stage) => stage.id === id);
      return stageData ? stageData.grade_name : "";
    };

    const term = (id: number) => {
      const termData = props.Terms?.find((term) => term.id === id);
      return termData ? termData.term_name : "";
    };

    const DeleteData = async (id: string) => {
      const token = localStorage.getItem("token") || "";
      const uri: { [key: string]: string } = {
        student: "student",
        test: "tests",
        homework: "homeworks",
        public_test: "public_tests",
        videos: "videos",
      };
      fetch(`${BaseUrl}/${uri[props.Type]}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            store.commit("logout");
            router.push("/login");
            return;
          }
        })
        .then((data) => props.RefReshFunc());
    };

    const EditData = (instace: any, isEdit: boolean) => {
      const EditData = {
        instace,
        edit: isEdit,
      };
      emit("edit", EditData);
    };

    const ShowData = (id: string) => {
      const uri: { [key: string]: string } = {
        student: "student",
        test: "test",
        homework: "homework",
        public_test: "publictest",
        videos: "video",
      };
      router.push(`/${uri[props.Type]}/${id}`);
    };

    const QRCodeGen = (url: string) => {
      emit("qrcode", url);
    };

    return {
      createOutlineIcon,
      trashOutlineIcon,
      eyeOutlineIcon,
      qrCodeOutlineIcon,
      BaseUrl,
      grade,
      term,
      DeleteData,
      EditData,
      ShowData,
      QRCodeGen,
    };
  },
});
</script>
<style>
.tableContainer {
  width: 100%;
}
.tableWrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px;
}
table {
  min-width: 800px;
  max-width: 950px;
}

table thead {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}

table thead tr th {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #ddd;
  font-weight: bold;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

table thead tr th:last-child {
  border-left: 1px solid #ddd;
}

table tbody tr td {
  padding: 8px;
  text-align: center;
  border-right: 1px solid #ddd;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.lastRow {
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.lastRow td:last-child {
  border-left: 1px solid #ddd;
}
</style>
