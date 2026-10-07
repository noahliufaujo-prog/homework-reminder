function addHomework() {
    const subject = document.getElementById("subject").value;
    const name = localStorage.getItem("studentName");
    const school = localStorage.getItem("schoolName");
    const homework = document.getElementById("homework").value;
    const dueDate = document.getElementById("dueDate").value;
    const dueTime = document.getElementById("dueTime").value;
    const priority = document.getElementById("priority").value;

    if (!subject || !homework || !dueDate || !dueTime || !priority) {
        document.getElementById("message").textContent =
            "⚠️ 모든 항목을 입력해주세요.";
        return;
    }
const newHomework = {
    id: Date.now().toString(),
    name: name,
    school: school,
    subject: subject,
    homework: homework,
    dueDate: dueDate,
    dueTime: dueTime,
    priority: priority,
    status: "미완료"
};
let homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];

fetch("https://hook.us2.make.com/wdgqd8ypujsdxqmk2gym1iwnaczcumgc", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newHomework)
});
homeworks.push(newHomework);

localStorage.setItem("homeworks", JSON.stringify(homeworks));

  const homeworkItem = document.createElement("div");

homeworkItem.innerHTML = `
    <strong>${newHomework.subject}</strong><br>
    과제: ${newHomework.homework}<br>
    마감: ${newHomework.dueDate} ${newHomework.dueTime}<br>
    중요도: ${newHomework.priority}<br>
    마감상태: ${getDeadlineStatus(newHomework.dueDate)}<br>
    상태: ${newHomework.status}<br>

    <button onclick="editHomework(${homeworks.length - 1})">
        ✏️ 수정
    </button>

    <button onclick="completeHomework(${homeworks.length - 1})">
        ✅ 완료
    </button>

    <button onclick="deleteHomework(${homeworks.length - 1})">
        🗑️ 삭제
    </button>

    <hr>
`;

document.getElementById("homeworkList").appendChild(homeworkItem);

    document.getElementById("message").textContent =
        "✅ 과제가 등록되었습니다!";

    document.getElementById("subject").value = "";
    document.getElementById("homework").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("dueTime").value = "";
    document.getElementById("priority").value = "";
}
window.addEventListener("load", function() {

    const savedName = localStorage.getItem("studentName");
    const savedSchool = localStorage.getItem("schoolName");

    if (savedName && savedSchool) {
        document.getElementById("profileSetup").style.display = "none";
        document.getElementById("homeworkForm").style.display = "block";
    } else {
        document.getElementById("profileSetup").style.display = "block";
        document.getElementById("homeworkForm").style.display = "none";
    }

    const homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];

    homeworks.forEach(function(item) {
        const homeworkItem = document.createElement("div");

     homeworkItem.innerHTML = `
    <strong>${item.subject}</strong><br>
    과제: ${item.homework}<br>
    마감: ${item.dueDate} ${item.dueTime}<br>
    중요도: ${item.priority}<br>
    마감상태: ${getDeadlineStatus(item.dueDate)}<br>
    상태: ${item.status}<br>
    <button onclick="editHomework(${homeworks.indexOf(item)})">
    ✏️ 수정
    </button> 
    <button onclick="completeHomework(${homeworks.indexOf(item)})">
    ✅ 완료
        <button onclick="deleteHomework(${homeworks.indexOf(item)})">
        🗑️ 삭제
    </button>
      <hr>
`;
        document.getElementById("homeworkList").appendChild(homeworkItem);
    });
});

function deleteHomework(index) {
    let homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];

    homeworks.splice(index, 1);

    localStorage.setItem("homeworks", JSON.stringify(homeworks));

    location.reload();
}
function getDeadlineStatus(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(dueDate);
    deadline.setHours(0, 0, 0, 0);

    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
        return "⚫ 마감 지남";
    } else if (diff === 0) {
        return "🔴 오늘 마감";
    } else if (diff <= 2) {
        return "🟡 곧 마감";
    } else {
        return "🟢 여유 있음";
    }
}
function editHomework(index) {
    let homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];
    const item = homeworks[index];

    document.getElementById("subject").value = item.subject;
    document.getElementById("homework").value = item.homework;
    document.getElementById("dueDate").value = item.dueDate;
    document.getElementById("dueTime").value = item.dueTime;
    document.getElementById("priority").value = item.priority;

    homeworks.splice(index, 1);
    localStorage.setItem("homeworks", JSON.stringify(homeworks));

    document.getElementById("message").textContent =
        "✏️ 내용을 수정한 후 다시 등록해주세요.";
}
function saveProfile() {
    const name = document.getElementById("name").value;
    const school = document.getElementById("school").value;

    if (!name || !school) {
        alert("이름과 학교 이름을 입력해주세요.");
        return;
    }

    localStorage.setItem("studentName", name);
    localStorage.setItem("schoolName", school);

    document.getElementById("profileSetup").style.display = "none";
    document.getElementById("homeworkForm").style.display = "block";
}
function completeHomework(index) {
    let homeworks = JSON.parse(localStorage.getItem("homeworks")) || [];

    if (!homeworks[index]) {
        alert("과제를 찾을 수 없습니다.");
        return;
    }

    homeworks[index].status = "완료";

    fetch("https://hook.us2.make.com/hsqq35q4jcsmpavj577kwu7myecy2nkq", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: homeworks[index].id,
            status: "완료"
        })
    });

    localStorage.setItem("homeworks", JSON.stringify(homeworks));

alert("완료 처리되었습니다!");

location.reload();
}
async function enableNotifications() {
    if (!("Notification" in window)) {
        alert("이 브라우저에서는 알림을 지원하지 않습니다.");
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        new Notification("Homework Reminder", {
            body: "🔔 알림이 활성화되었습니다!"
        });
    } else {
        alert("알림 권한이 허용되지 않았습니다.");
    }
}
