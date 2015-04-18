var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('_gAIqkrAdNo6SSMbP2mDFQ');

var fs = require('fs');
var ejs = require('ejs'); // loading EJS into our project
var tumblr = require('tumblr.js');

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'xt35kKBXuNnchAG6LYjvzNUQkN7LXwRneWNlcFbMZxA63LGrVk',
  consumer_secret: 'XJ25ZRRirOVaLMyXm538JLC7As8koIQA5hsmmOfkzRqvuNvqkp',
  token: 'JYW8QPYQHbiDhVbnePFhuMMnGq42484xdyN3rpGeBiRADdjuUY',
  token_secret: 'n5bPfJ82kinavPlZZylk9cbGG24NPyV02N6wvw7u6ZN0eP9OUt'
});

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');
var latestPosts = [];

friendList = csvParse(csvFile);

client.posts('coding-adventures.tumblr.com', function(err, blog){
  
  	for(var i=0; i<blog.posts.length; i++){
  		var dateOfPost = new Date(blog.posts[i].date);
  	  	var dateNow = new Date();
  	  	var elapsedTime = dateNow - dateOfPost;
  								
  	  	var daysElapsed = elapsedTime / (86400000);//1000*60*60*24 //to secs min hours days
  		if(daysElapsed<7){
	  		latestPosts.push(blog.posts[i]);
  		}
	}

	friendList.forEach(function(row){
	    var numMonthsSinceContact = row["numMonthsSinceContact"];
		var sendToName = row["firstName"];
		var sendTOEmail = row["emailAddress"];
		var sendFromName = "Tremayne";
		var sendFromEmail = "tremaynerod@gmail.com";
		var subject = "testing";
	
		var templateObject = {firstName: sendToName, numMonthsSinceContact: numMonthsSinceContact, latestPosts: latestPosts}
		var customizedTemplate = ejs.render(emailTemplate, templateObject);	
		sendEmail(sendToName, sendTOEmail, sendFromName, sendFromEmail, subject, customizedTemplate);
	});
	
});

function csvParse(csvFile){
    var arrayOfObjects = [];
    var arr = csvFile.split("\n");
    var newObj;

    keys = arr.shift().split(",");

    arr.forEach(function(contact){
        contact = contact.split(",");
        newObj = {};

        for(var i =0; i < contact.length; i++){
            newObj[keys[i]] = contact[i];
        }

        arrayOfObjects.push(newObj);

    });
    return arrayOfObjects;
};

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 };

