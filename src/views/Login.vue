<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="login-container">
        <h1>تسجيل الدخول</h1>

        <div class="inputs">
          <div class="input" :class="{ error: error.username }">
            <ion-input
              label="اسم المستخدم"
              label-placement="stacked"
              placeholder="أدخل اسم المستخدم"
              dir="rtl"
              @ionChange="username = String($event.target.value) || ''"
            ></ion-input>
          </div>
          <div class="input" :class="{ error: error.password }">
            <ion-input
              type="password"
              label-placement="stacked"
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              dir="rtl"
              @ionChange="password = String($event.target.value) || ''"
            >
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </div>
          <div dir="rtl" class="error-message" v-if="error.message != ''">
            <p>{{ error.message }}</p>
          </div>
          <ion-button @click="Login()" color="primary" expand="block"
            >تسجيل الدخول</ion-button
          >
        </div>
      </div>
    </ion-content>
    <ion-alert
      :is-open="isOpen"
      header="خطأ"
      sub-header="لقد حدث خطأ ما"
      :message="message"
      :buttons="alertButtons"
      @didDismiss="setOpen(false)"
    ></ion-alert>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { BaseUrl } from "@/utils/BaseUrl";

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonInputPasswordToggle,
  IonAlert,
} from "@ionic/vue";

interface ErrorObject {
  message: string;
  username: boolean;
  password: boolean;
}

export default defineComponent({
  name: "Login",
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonButton,
    IonInputPasswordToggle,
    IonAlert,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref<string>("");
    const password = ref<string>("");
    const alertButtons = ref<string[]>(["موافق"]);
    const isOpen = ref<boolean>(false);
    const message = ref<string>("");
    const error = ref<ErrorObject>({
      message: "",
      username: false,
      password: false,
    });

    onMounted(() => {
      store.commit("initializeStore");
      if (store.state.isAuthenticated) {
        router.push("/dashboard");
      }
    });

    function setOpen(state: boolean) {
      isOpen.value = state;
    }

    function Login() {
      if (username.value === "") {
        error.value.username = true;
        error.value.message = "من فضلك ادخل اسم المستخدم";
      } else {
        error.value.username = false;
        error.value.message = "";
      }

      if (password.value === "") {
        error.value.password = true;
        error.value.message = "من فضلك ادخل كلمة المرور";
      } else {
        error.value.message = "";
        error.value.password = false;
      }

      if (username.value !== "" && password.value !== "") {
        fetch(BaseUrl + "/teacher/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value,
          }),
        })
          .then((response) => {
            if (response.status === 401) {
              store.commit("logout");
              router.push({ name: "Login" });
              return;
            }

            if (response.status === 500) {
              return response.json().then((data) => {
                message.value = data.message;
                setOpen(true);
              });
            }

            return response.json();
          })
          .then((data) => {
            if (data.token) {
              store.commit("setToken", data.token);
              router.push("/dashboard");
              return;
            }
          });
      }
    }

    return {
      username,
      password,
      alertButtons,
      isOpen,
      message,
      error,
      Login,
      setOpen,
    };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input {
  border-bottom: 2px solid var(--ion-color-primary);
}

.error {
  border-bottom: 2px solid var(--ion-color-danger);
}
.error-message {
  color: var(--ion-color-danger);
  text-align: center;
}
</style>
