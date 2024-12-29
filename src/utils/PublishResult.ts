import { BaseUrl } from "./BaseUrl";
export default function PublishResult(
  type: string,
  id: number,
  student_id: string,
  published: boolean,
  store: any,
  router: any,
  reFetch: () => void
) {
  const bodyData = {
    type,
    id,
    published,
    student_id,
  };
  fetch(`${BaseUrl}/teacher/publish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => {
      if (response.status === 401) {
        store.commit("logout");
        router.push("/login");
        return;
      }
    })
    .then((data) => reFetch());
}
