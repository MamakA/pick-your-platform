/* This is the main JS file for this app, grunts out to <packagename>.js */
var COUNCILVOTES        = {};
    COUNCILVOTES.config = {
        dataFile: 'WinnipegCouncilVotes.csv'
    }

var winnipegWards   = {
    "Bowman":       { "Ward":" City", "Fullname":" Mayor Brian Bowman" },
    "Gillingham":   { "Ward":" St. James-Brooklands", "Fullname":" Scott Gillingham" },
    "Morantz":      { "Ward":" Charleswood-Tuxedo", "Fullname":" Marty Morantz" },
    "Lukes":        { "Ward":" St. Norbert", "Fullname":" Janice Lukes" },
    "Wyatt":        { "Ward":" Transcona", "Fullname":" Russ Wyatt" },
    "Orlikow":      { "Ward":" River Heights-Fort Garry", "Fullname":" John Orlikow" },
    "Allard":       { "Ward":" St. Boniface", "Fullname":" Matt Allard" },
    "Browaty":      { "Ward":" North Kildonan", "Fullname":" Jeff Browaty" },
    "Dobson":       { "Ward":" St. Charles", "Fullname":" Shawn Dobson" },
    "Eadie":        { "Ward":" Mynarski", "Fullname":" Ross Eadie" },
    "Gerbasi":      { "Ward":" Fort Rouge-East Fort Garry", "Fullname":" Jenny Gerbasi" },
    "Gilroy":       { "Ward":" Daniel McIntyre", "Fullname":" Cindy Gilroy" },
    "Mayes":        { "Ward":" St. Vital", "Fullname":" Brian Mayes" },
    "Pagtakhan":    { "Ward":" Point Douglas", "Fullname":" Mike Pagtakhan" },
    "Schreyer":     { "Ward":" Elmwood-East Kildonan", "Fullname":" Jason Schreyer" },
    "Sharma":       { "Ward":" Old Kildonan", "Fullname":" Devi Sharma"}
};

var webmillCacheURLBase     = '/webmill/news/interactives/data/',
    dataURL                 = webmillCacheURLBase + COUNCILVOTES.config.dataFile,
    ds,
    htmlMarkup              = '',
    votesYes                = '',
    votesNo                 = '',
    votesAbstain            = '',
    voteCountYes            = '',
    voteCountNo             = '',
    voteCountAbstain        = '',
    voteCountHTMLMarkup     = '',
    fieldName,
    fieldData,
    councilDetails,
    councilID,
    councilWard,
    councilVoteString,
    councilFullname,
    councilImage;

function init(){

   ds = new Miso.Dataset({
        url : dataURL,
        delimiter : ',',
   });

    ds.fetch({
        success: function(){
            // voteData = ds.toJSON();
            // console.log("voteData %o", voteData);

            votesYes        = '';
            votesNo         = '';
            votesAbstain    = '';

            ds.each(function(row, rowIndex) {


                this.eachColumn(function(colName, colObject, index) {
                    fieldName = colName;
                    fieldData = colObject.data[0];

                    assembleCouncilCard(fieldName, fieldData);

                });


            });

            $('#council-votes').append(votesYes);
            $('#council-votes').append(votesNo);
            $('#council-votes').append(votesAbstain);

        },
        error: function(err){
            if(window.console) console.error('Error fetching data: ', err);
        }
    });

}

function assembleCouncilCard(fieldName, fieldData){

    if(fieldName == 'vote_id'){
        // $('#councilVoteItem').html(fieldData);
    }
    else if(fieldName == 'vote_title'){
        $('#councilVoteItem').html(fieldData);
    }
    else if(fieldName == 'vote_desc'){
        $('#councilVoteDesc').html(fieldData);
    }
    /* Convert date from timestamp */
    else if(fieldName == 'vote_date'){
        var timeString = timeConverter(fieldData);
        // $('#voteDate').html(timeString);
    }
    else{
        /* This is a council member, their vote counts. */

        councilID       = fieldName;
        councilDetails  = winnipegWards[councilID];

        if(councilDetails["Ward"] == 'city'){
            councilWard = '';
        }
        else{
            councilWard = councilDetails["Ward"];
        }

        councilFullname = councilDetails["Fullname"];
        councilImage    = councilID.toLowerCase() + '.png';
        councilVote     = fieldData;

        if(councilVote == 'Y'){
            councilVoteString = 'Yes';
        }
        else if(councilVote == 'N'){
            councilVoteString = 'No';
        }
        else{
            councilVoteString = 'Abstain';
        }

        //voteCountHTMLMarkup = '<li class="voteCount vote-' + councilVoteString + '" title="' + councilFullname + ': ' + councilVoteString + '"></li>';

        htmlMarkup      = ' '
                        + '<li class="councillor vote-' + councilVoteString + '" id="councillor-' + councilID + '">' + "\n"
                        + '     <div class="councillor-headshot"></div>'
                        + '     <div class="councillor-details">' + "\n"
                        + '         <b class="vote vote-' + councilVoteString + '">' + councilVoteString + '</b>' + "\n"
                        + '         <b class="fullname">' + councilFullname + '</b>' + "\n"
                        + '         <b class="ward">' + councilWard + '</b>' + "\n"
                        + '     </div>' + "\n"
                        + '</li>' + "\n\n";

        /* Drop it in the right bucket */
        if(councilVote == 'Y'){
            votesYes            += htmlMarkup;
            // voteCountYes        += voteCountHTMLMarkup;
        }
        else if(councilVote == 'N'){
            votesNo             += htmlMarkup;
            // voteCountNo         += voteCountHTMLMarkup;
        }
        else{
            votesAbstain        += htmlMarkup;
            // voteCountAbstain    += voteCountHTMLMarkup;
        }

    }






}


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ', ' + year;
    return time;
}

init();

