export function notifyMe(text: string) {
    // Проверка поддержки браузером уведомлений
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Проверка разрешения на отправку уведомлений
    else if (Notification.permission === "granted") {
      // Если разрешено, то создаём уведомление
      var notification = new Notification(text, {
        body: text,
      });
    }
  
    // В противном случае, запрашиваем разрешение
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // Если пользователь разрешил, то создаём уведомление
        if (permission === "granted") {
          var notification = new Notification(text);
        }
      });
    }

    console.log(Notification.permission);
  
    // В конечном счёте, если пользователь отказался от получения
    // уведомлений, то стоит уважать его выбор и не беспокоить его
    // по этому поводу.
  }
  