# n8n-nodes-rss-feed-trigger

This is an n8n community node. It lets you use an RSS Feed to trigger your workflows. For testing https://lorem-rss.herokuapp.com/feed can be used.

This trigger node will get any items that have a published date that is after the date of the last run of the trigger.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Version history](#version-history) 

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* Example Workflows can be found in the _examples folder
  * rss_to_slack.json - This posts updates from wtf1.com to Slack, It has a function node to build the Slack message but also has an option to use the [Document Generator](https://www.npmjs.com/package/n8n-nodes-document-generator) node

## Version history

0.1.2 - Fixed activation issue \
0.1.1 - When running manually it will return the first item for the feed \
0.1.0 - Initial Release
