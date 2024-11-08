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
              @ionChange="username = $event.target.value"
            ></ion-input>
          </div>
          <div class="input" :class="{ error: error.password }">
            <ion-input
              type="password"
              label-placement="stacked"
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              dir="rtl"
              @ionChange="password = $event.target.value"
            >
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </div>
          <div dir="rtl" class="error-message" v-if="error.message != ''">
            <p>{{ error.message }}</p>
          </div>
          <ion-button @click="login()" color="primary" expand="block"
            >تسجيل الدخول</ion-button
          >
          <p>
            {{ data }}
          </p>
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

<script>
import axios from "axios";
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

export default {
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
  data: () => {
    return {
      username: "",
      password: "",
      data: "",
      alertButtons: ["موافق"],
      isOpen: false,
      message: "",
      error: {
        message: "",
        username: false,
        password: false,
      },
    };
  },
  mounted() {
    this.$store.commit("initializeStore");
    if (this.$store.state.isAuthenticated) {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    setOpen(isOpen) {
      this.isOpen = isOpen;
    },
    login() {
      if (this.username == "") {
        this.error.username = true;
        this.error.message = "من فضلك ادخل اسم المستخدم";
      } else {
        this.error.username = false;
        this.error.message = "";
      }
      if (this.password == "") {
        this.error.password = true;
        this.error.message = "من فضلك ادخل كلمة المرور";
      } else {
        this.error.message = "";
        this.error.password = false;
      }

      if (this.username !== "" && this.password !== "") {
        axios
          .post("/teacher/login", {
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            this.data = response.data;
            this.$store.commit("setToken", response.data.token);
            this.$router.push("/dashboard");
          })
          .catch((error) => {
            this.message = error.response.data.message;
            this.isOpen = false;
            this.isOpen = true;
          });
      }
    },
  },
};
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
