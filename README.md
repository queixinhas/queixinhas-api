# Queixinhas

Queixinhas is a civic report tool which empowers people to solve problems in their countries, cities or neighbourhoods.

The goal is to create an open database of reports, giving the community some benefits:

+ Easy for people to post and gather for a cause, demanding results;
+ Allow the local power to understand what problems affect their communities;
+ **Power to the people!**

## API

This is the API which allows the access and creation of reports.

**The API is still in an unstable state**

### Documentation

#### GET /reports/:reportID
The return type is a JSON object which represents the report with the given ID

    {
    	"id"          : "1",
    	"name"        : "A name",
    	"description" : "A description",
    	"tags"        : ["tag1", "tag2"],
    	"location"    : {lon: -9.3567, lat: 39.8365},
    	"address"     : "An address",
    	"mediaItems"  : ["http://a-media-item-url"]
    }
    
#### POST /reports
The content type should be `application/json`. The body should be a JSON object representing the report

    {
    	"id"          : "1",
    	"name"        : "A name",
    	"description" : "A description",
    	"tags"        : ["tag1", "tag2"],
    	"location"    : {lon: -9.3567, lat: 39.8365},
    	"address"     : "An address",
    	"mediaItems"  : ["http://a-media-item-url"]
    }
    
#### POST /images
The content type should be `multi-part/form-data` and the body should only contain the image to be uploaded.

A sample request using curl: `curl -F file=@/home/user/image.jpg http://queixinhas-api.com/images`.

A successful request should get the following response:

    {
    	"success" : true,
    	"url"     : "http://url-to-the-uploaded-image"
    }
