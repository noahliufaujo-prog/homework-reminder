self.addEventListener("push", function(event) {
    const data = event.data ? event.data.json() : {};

    const title = data.title || "Homework Reminder";
    const options = {
        body: data.body || "새로운 과제 알림이 있습니다.",
        icon: "homework-icon.png",
        badge: "homework-icon.png"
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});