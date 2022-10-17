import { CentreModal } from "./centreModal.mjs";



const regLoginForm = document.querySelector(".reg-login-form");
const regLoginErrorModalWrapper = document.querySelector(".centre-modal-wrapper");
const regLoginErrorModal = new CentreModal(regLoginErrorModalWrapper);
regLoginErrorModal.init();

regLoginForm.addEventListener("submit", evt => {
  evt.preventDefault();
  handleRegLoginClick(evt);
});

async function handleRegLoginClick(evt) {
  const form = evt.currentTarget;
  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData.entries());

  const fetchResponse = await fetch(form.action, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formDataObj)
  });

  const userRegLoginResponse = await fetchResponse.json();

  if (userRegLoginResponse.status === "success") {
    console.log(`redirecting to ${userRegLoginResponse.redirectTo}`);
    window.location.assign(userRegLoginResponse.redirectTo)
  }
  else {
    regLoginErrorModal.show();
  };
}
