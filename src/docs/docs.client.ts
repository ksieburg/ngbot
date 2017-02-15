import {MessageModel} from '../angie/gitter';
import {ReplyClient} from '../reply-client';
import {ApiModule, Api} from './api-docs-module';
import {Http} from '../util/http';
import {getTextPart} from '../util/cli-helper';

export class DocsClient implements ReplyClient {

  private docsApiBaseUrl = 'https://angular.io/docs/ts/latest/api';
  private docsApiUrl = this.docsApiBaseUrl + '/api-list.json';
  private apis: Api[];

  constructor(private http = new Http(), fallback = null) {
    // We can provide a static fallback to use before observable is completed
    // Good for testing, too
    this.apis = this.processDocs(fallback);

    // If no http is given, don't even attempt to connect
    if (this.http) {
      this.http.get<ApiModule>(this.docsApiUrl).subscribe(docs => {
        this.apis = this.processDocs(docs);
      });
    }
  }

  private processDocs(docs): Api[] {
    return Object.keys(docs)
      .map(key => docs[key])
      // flatten out the modules into a single list of APIs
      .reduce((a, b) => [...a, ...b], []);
  }

  getGlobal(message: MessageModel) {
    return null;
  }

  getReply(message: MessageModel) {
    const text = message.text;
    const messageParts = text.split(' ');

    if (getTextPart(messageParts, 1) === 'docs') {
      let matchedApi = this.apis.find(api => {
        return text.toLowerCase().includes(api.title.toLowerCase());
      });

      let reply: string;
      if (matchedApi) {
        reply = `${this.docsApiUrl}/${matchedApi.path}`;
      } else {
        reply = `Unable to find docs for: ${messageParts.slice(2).join(' ')}`;
      }
      return reply;
    }
  }

}