//Data Service used without real backend.
function FakeDataService() {

    function GetAllChiefs() {
        let subject = new Rx.Subject();

        $.ajax({
            url: "FakeData/Chiefs.json",
            cache: false,
            success: function(data){
                Enumerable.from(data.ChiefList).forEach(x => subject.next(x));
            }
        });
        return subject;
    }

    function ArraysIntersect(arr1, arr2)
    {
        let res = Enumerable.from(arr1).where(x => arr2.includes(x)).firstOrDefault();
        return (res != null);
    }


    return {

        GetChief: function(id)
        {
            return this.QueryData("Chief", {"id": id});
        },
        //Returns observable of entities matching given arguments.
        QueryData: function(entity, args)
        {
            if (entity === "Chief") {
                return this.QueryChiefs(args["id"], args["name"], args["surname"], args["tags"], args["location"]);
            }

        },

        QueryChiefs: function(id = null, name = null, surname = null, tags = null, location = null)
        {
            let subject = new Rx.Subject();

            let chiefsObservable = GetAllChiefs();

            chiefsObservable.subscribe(
                chief =>
                {
                    if (id != null && chief.Id !== id) return;
                    if (name != null && chief.Name !== name) return;
                    if (surname != null && chief.Surname !== surname) return;
                    if (location != null && chief.Location !== location) return;
                    if (tags != null && !this.ArraysIntersect(chief.Tags, tags)) return;
                    subject.next(chief);
                }
            );

            return subject;
        },

        //Returns ReturnCode based on update completion status.
        UpdateData: function(entity, args)
        {
            //No updates for fake data
            return 0;
        },

        //Returns some stuff to authorize and add to cookies etc.
        Authorize: function(username, password)
        {
            //Always authorizes
            return true;
        }
    };
}