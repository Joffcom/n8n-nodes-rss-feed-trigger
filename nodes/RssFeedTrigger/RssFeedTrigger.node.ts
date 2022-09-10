import moment from 'moment';
import { IPollFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import Parser from 'rss-parser';

export class RssFeedTrigger implements INodeType {
	description : INodeTypeDescription = {
		displayName: 'RSS Feed Trigger',
		name: 'rssFeedTrigger',
		icon: 'fa:rss',
		group: ['trigger'],
		version: 1,
		description: 'Starts a workflow when an RSS feed is updated',
		subtitle: '={{$parameter["event"]}}',
		defaults : {
			name: 'RSS Feed Trigger',
		},
		polling: true,
		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Feed URL',
				name: 'feedUrl',
				type: 'string',
				default: '',
				required: true,
				description: 'URL of the RSS feed to poll',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const pollData = this.getWorkflowStaticData('node');
		const feedUrl = this.getNodeParameter('feedUrl') as string;

		const now = moment().utc().format();
		const startDate = (pollData.lastTimeChecked as string) || now;
		const endDate = now;

		try {
			if (!feedUrl) {
				throw new NodeOperationError(this.getNode(), 'The parameter "URL" has to be set!');
			}

			const parser = new Parser();

			let feed: Parser.Output<IDataObject>;
			try {
				feed = await parser.parseURL(feedUrl);
			} catch (error) {
				if (error.code === 'ECONNREFUSED') {
					throw new NodeOperationError(
						this.getNode(),
						`It was not possible to connect to the URL. Please make sure the URL "${feedUrl}" it is valid!`,
					);
				}

				throw new NodeOperationError(this.getNode(), error);
			}

			const returnData: IDataObject[] = [];

			// For now we just take the items and ignore everything else
			if (feed.items) {
				feed.items.forEach((item) => {
					// @ts-ignore
					if (Date.parse(item.isoDate) >= Date.parse(startDate)) {
						// @ts-ignore
						returnData.push(item);
					}
				});

			}
			pollData.lastTimeChecked = endDate;
			if (Array.isArray(returnData) && returnData.length !== 0) {
				return [this.helpers.returnJsonArray(returnData)];
			}
			return null;
		} catch (error) {
			return [this.helpers.returnJsonArray(error)];
		}
	}
}
