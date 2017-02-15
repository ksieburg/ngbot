import {DocsClient} from '../../src/docs/docs.client';
import {MessageModel} from '../../src/angie/gitter';


describe(`Docs Client`, () => {

  const client = new DocsClient(null, {
      "@angular/common": [
        {
          "title": "AsyncPipe",
          "path": "common/index/AsyncPipe-pipe.html",
          "docType": "pipe",
          "stability": "stable",
          "secure": "false",
          "barrel": "@angular/common"
        },
        {
          "title": "CommonModule",
          "path": "common/index/CommonModule-class.html",
          "docType": "class",
          "stability": "stable",
          "secure": "false",
          "barrel": "@angular/common",
        },
      ],
    }
  );

  const dummyMessage: MessageModel = {
    id: "53316ec37bfc1a0000000011",
    text: "angie docs AsyncPipe",
    html: "angie docs AsyncPipe",
    sent: "2014-03-25T11:55:47.537Z",
    editedAt: null,
    fromUser: {
      id: "53307734c3599d1de448e192",
      username: "malditogeek",
      displayName: "Mauro Pompilio",
      url: "/malditogeek",
      avatarUrlSmall: "https://avatars.githubusercontent.com/u/14751?",
      avatarUrlMedium: "https://avatars.githubusercontent.com/u/14751?"
    },
    unread: false,
    readBy: 0,
    urls: [],
    mentions: [],
    issues: [{
      number: "11"
    }],
    meta: {},
    v: 1,
  };

  it(`should get docs for an existing entry`, () => {
    Object.assign(dummyMessage, {text: 'angie docs AsyncPipe'});
    const actual = client.getReply(dummyMessage);
    const expected = `***[\`AsyncPipe\`](https://angular.io/docs/ts/latest/api/api-list.json` +
      `/common/index/AsyncPipe-pipe.html)*** is a **pipe** found in \`@angular/common\` and ` +
      `is considered *stable*.`;
    expect(actual).toEqual(expected);
  });

  it(`should provide a helpful message if docs don't exist`, () => {
    Object.assign(dummyMessage, {text: 'angie docs nonsense'});
    const actual = client.getReply(dummyMessage);
    const expected = `Unable to find docs for: nonsense`;
    expect(actual).toEqual(expected);
  });

  it(`should provide a helpful message if docs don't exist (for more than one word)`, () => {
    Object.assign(dummyMessage, {text: 'angie docs some nonsense goes here'});
    const actual = client.getReply(dummyMessage);
    const expected = `Unable to find docs for: some nonsense goes here`;
    expect(actual).toEqual(expected);
  });

});
