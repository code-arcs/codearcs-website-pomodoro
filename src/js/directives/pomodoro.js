angular.module('PomodoroApp')
    .directive('pomodoro', ['$interval', function ($interval) {
        return {
            restrict: 'EA',
            templateUrl: 'src/js/view/pomodoro.html',
            link: function (scope) {
                scope.timerValue = 0;
                scope.selected = 0;
                scope.statusKey = "work";
                scope.params = {
                    "timePerIteration": 25,
                    "iterations": 4,
                    "shortBreak": 5,
                    "longBreak": 25
                };

                var timer;
                var timerSequence = [];
                var status = {
                    work: {
                        title: "Work",
                        body: "Work on the task"
                    },
                    shortBreak: {
                        title: "Short break",
                        body: "Take a short break"
                    },
                    longBreak: {
                        title: "Long break",
                        body: "Take a long break"
                    }
                };

                scope.start = function () {
                    if (angular.isDefined(timer)) return;

                    scope.selected = 1;
                    initPomodoro();

                    timer = $interval(function () {
                        scope.timerValue -= 1000;
                        if (scope.timerValue <= 0) {
                            setActTimer();
                            notification();
                        }
                    }, 1000);

                    function setActTimer() {
                        scope.timerValue = timerSequence.pop();
                        if (timerSequence.length % 2 === 1) {
                            scope.statusKey = "work";
                        } else {
                            if (timerSequence.length > 1) {
                                scope.statusKey = "shortBreak";
                            } else {
                                scope.statusKey = "longBreak";
                            }

                        }
                        if (!scope.timerValue) {
                            scope.stop();
                        }
                    }
                };

                scope.stop = function () {
                    $interval.cancel(timer);
                    timer = undefined;
                    scope.timerValue = 0;
                    scope.selected = 0;
                };

                function initPomodoro() {
                    timerSequence = [];

                    timerSequence.push(minToMs(scope.params.longBreak));
                    for (var i = 0; i < scope.params.iterations - 1; i++) {
                        timerSequence.push(minToMs(scope.params.timePerIteration));
                        timerSequence.push(minToMs(scope.params.shortBreak));
                    }
                    timerSequence.push(minToMs(scope.params.timePerIteration));
                }

                function minToMs(min) {
                    return min * 60 * 1000;
                }

                function notification() {
                    if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                    }

                    // Let's check whether notification permissions have alredy been granted
                    else if (Notification.permission === "granted") {
                        // If it's okay let's create a notification
                       new Notification(status[scope.statusKey].title, {
                            body: status[scope.statusKey].body,
                            icon: "src/img/Tomate.png"
                        });
                    }

                    // Otherwise, we need to ask the user for permission
                    else if (Notification.permission !== 'denied') {
                        Notification.requestPermission(function (permission) {
                            // If the user accepts, let's create a notification
                            if (permission === "granted") {
                               new Notification(status[scope.statusKey].title, {
                                    body: status[scope.statusKey].body,
                                    icon: "src/img/Tomate.png"
                                });
                            }
                        });
                    }
                }
            }
        };
    }]
);