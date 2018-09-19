let currentWindow = document.location.hash;
let selectedChief = 1;

if (currentWindow == "") currentWindow = "index";
else currentWindow = currentWindow.substr(1);
LoadWindow(currentWindow);

function SelectChief(idString)
{
    selectedChief = parseInt(idString);
}

function LoadWindow(windowName)
{
    let subject = new Rx.Subject();
    $( "#main-container" ).load( windowName+".html", function() {
        subject.next(true);
        currentWindow = windowName;
        document.location.hash = windowName;
        WindowLoaded();
    });

    return subject;
}

function WindowLoaded()
{
    switch (currentWindow)
    {
        case "chiefList":
            LoadChiefList();
            break;
        case "chief":
            LoadChief();
            break;
        default:
            break;
    }
}


function LoadChief()
{
    let chief = mainService.GetDataService().GetChief(selectedChief);

    chief.subscribe(ch =>
    {
        console.log(ch);
        FillChiefDetails($("#main-container"), ch);
    });
}

function LoadChiefList()
{
    let chiefs = mainService.GetDataService().QueryData("Chief", {});
    let cont = $("#chief-container");

    chiefs.subscribe(chief =>
    {
        cont.append("<div id='chief-"+chief.Id+"' class=\"col-lg-4 col-sm-6 portfolio-item\"></div>");
        let chiefCard = $("#chief-"+chief.Id);
        chiefCard.load("chiefCard.html", function() {
            FillChiefDetails(chiefCard, chief);
        });
    });
}

function FillChiefDetails(element, chief)
{
    element.html(function (i, html) {
        for (let prop in chief) {
            html = html.replace(new RegExp("{{"+prop+"}}", 'g'), chief[prop]);
        }
        return html;
    });
}