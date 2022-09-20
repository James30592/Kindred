const createUsersBtn = document.querySelector(".create-users");
const createUsersInput = document.querySelector("input[name='create-users-num']")

createUsersBtn.addEventListener("click", createUsers);


async function createUsers(){
  const data = {numNewUsers: createUsersInput.value};

  const fetchResponse = await fetch("/admin/createAutoUsers", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  const svrMsg = await fetchResponse.text();

  // Update the log.
  const element = document.querySelector(".admin-log");
  element.textContent = "";

  const para = document.createElement("p");
  const node = document.createTextNode(svrMsg);
  para.appendChild(node);
  element.appendChild(para);

  setTimeout(function(){
    element.textContent = ""
  }, 5000);
}
