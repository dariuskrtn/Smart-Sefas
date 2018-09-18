let mainService = new MainService();
function MainService() {
    let mainService = null;
    let dataService = new FakeDataService();

    return {
        GetDataService: function()
        {
        return dataService;
        }
    };

}