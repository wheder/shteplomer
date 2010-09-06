var layout = new LinearLayout();
plasmoid.layout = layout;
ulabel = new Label;
layout.addItem(ulabel);

if (plasmoid.getUrl) {
    plasmoid.aspectRatioMode = IgnoreAspectRatio;
    var updateTimer = new QTimer;
    updateTimer.singleShot = false; // repeat countdouwn, not only once
    updateTimer.timeout.connect(get_temperature);
    read_config();
    get_temperature();
    plasmoid.configChanged = function() {
        read_config();
        get_temperature();
    }
}
else {
    label.text = i18n("Can't start: No HTTP Extension available.");
}

function read_config() {
    ulabel.font = plasmoid.readConfig("showFont")
    updateTimer.start(plasmoid.readConfig("updateIntervalConf")*60*1000);
}

function get_temperature() {
    var tmp = "";
    var getJob = plasmoid.getUrl("http://weather.sh.cvut.cz/export/teplota.php");
    getJob.data.connect(recv);
    getJob.finished.connect(fini);
    var timedOut = 0;
    var timeOut = new QTimer();
    timeOut.timeout.connect(fail);
    timeOut.start(10000); // 10 secs oughta be enough
    timeOut.singleShot = 1;
    function recv(job, data) {
        if (data.length) {
            tmp += data.valueOf();
        }
    }
    function fini(job) {
        if (!timedOut) {
            timeOut.stop();
            //var re = new RegExp(/Aktualni teplota :(.*)(.)<\/h1>(.*)/)
            var re = new RegExp(/(.*)/)
            var teplota = re.exec(tmp);
            ulabel.text = teplota[1]
            //print(teplota)
        }
    }
    function fail() {
        timedOut = 1;
        ulabel.text = i18n("Can't fetch temperature! Timed out!")
        getJob.kill();
    }
}

//inspired in http://kde-look.org/content/show.php/HoN-Stats?content=122784